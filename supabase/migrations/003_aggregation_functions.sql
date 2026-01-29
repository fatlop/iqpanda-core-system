-- Función para agregar métricas diarias
CREATE OR REPLACE FUNCTION aggregate_daily_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO daily_demo_metrics (demo, date, interactions_count, avg_latency, completion_rate, error_rate)
  SELECT
    demo,
    date_trunc('day', created_at)::date,
    count(*) as interactions_count,
    avg(latency_ms) as avg_latency,
    count(*) FILTER (WHERE outcome = 'completed')::numeric / NULLIF(count(*), 0) as completion_rate,
    count(*) FILTER (WHERE outcome = 'error')::numeric / NULLIF(count(*), 0) as error_rate
  FROM ritual_logs
  WHERE created_at >= CURRENT_DATE - INTERVAL '2 days'
    AND created_at < CURRENT_DATE
  GROUP BY demo, date_trunc('day', created_at)::date
  ON CONFLICT (demo, date) 
  DO UPDATE SET
    interactions_count = EXCLUDED.interactions_count,
    avg_latency = EXCLUDED.avg_latency,
    completion_rate = EXCLUDED.completion_rate,
    error_rate = EXCLUDED.error_rate;
END;
$$;

-- Función para crear snapshots de usuarios CON CLASIFICACIÓN
CREATE OR REPLACE FUNCTION create_user_snapshots()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Paso 1: Actualizar snapshots básicos (conteos de interacciones)
  INSERT INTO user_activity_snapshots (user_id, demo, last_activity, interactions_30d, updated_at)
  SELECT
    user_id,
    demo,
    max(created_at) as last_activity,
    count(*) as interactions_30d,
    NOW() as updated_at
  FROM ritual_logs
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY user_id, demo
  ON CONFLICT (user_id, demo)
  DO UPDATE SET
    last_activity = EXCLUDED.last_activity,
    interactions_30d = EXCLUDED.interactions_30d,
    updated_at = EXCLUDED.updated_at;

  -- Paso 2: Calcular clasificación de perfiles por usuario
  WITH user_aggregates AS (
    SELECT 
      user_id,
      
      -- Interacciones por tipo de demo
      COALESCE(SUM(interactions_30d) FILTER (
        WHERE demo IN ('diagnostico_mecanico', 'analisis_electrico', 'auditoria_red')
      ), 0) AS tech_interactions,
      
      COALESCE(SUM(interactions_30d) FILTER (
        WHERE demo IN ('crm_inteligente', 'catalogos_digitales')
      ), 0) AS business_interactions,
      
      COALESCE(SUM(interactions_30d) FILTER (
        WHERE demo IN ('generador_branding', 'guiones_video')
      ), 0) AS creative_interactions,
      
      SUM(interactions_30d) AS total_interactions,
      COUNT(DISTINCT demo) AS demos_count
      
    FROM user_activity_snapshots
    GROUP BY user_id
  ),
  user_classifications AS (
    SELECT
      user_id,
      
      -- Clasificación de perfil (mismas reglas que TypeScript)
      CASE
        WHEN tech_interactions > 10 AND tech_interactions > business_interactions * 2 
          THEN 'tecnico_activo'
        
        WHEN business_interactions > 5 AND total_interactions > 15 
          THEN 'negocio_en_validacion'
        
        WHEN creative_interactions > 8 
          THEN 'creativo_recurrente'
        
        WHEN total_interactions > 20 AND business_interactions > 10 
          THEN 'cliente_listo_para_conversion'
        
        WHEN demos_count >= 3 AND total_interactions > 5 
          THEN 'usuario_explorador'
        
        ELSE 'usuario_explorador'
      END AS profile,
      
      -- Cálculo de confianza
      LEAST(1.0, 
        0.3 + -- baseline
        CASE 
          WHEN total_interactions > 20 THEN 0.3
          WHEN total_interactions > 10 THEN 0.2
          WHEN total_interactions > 5 THEN 0.1
          ELSE 0 
        END +
        CASE 
          WHEN demos_count > 5 THEN 0.2
          WHEN demos_count > 3 THEN 0.1
          ELSE 0 
        END +
        CASE 
          WHEN demos_count > 3 THEN 0.1
          ELSE 0 
        END
      ) AS confidence_score
      
    FROM user_aggregates
  )
  UPDATE user_activity_snapshots AS uas
  SET 
    profile_classification = uc.profile,
    confidence = uc.confidence_score
  FROM user_classifications AS uc
  WHERE uas.user_id = uc.user_id;
END;
$$;

COMMENT ON FUNCTION create_user_snapshots() IS 'Agrega snapshots de actividad Y calcula clasificación de perfiles con confianza';
