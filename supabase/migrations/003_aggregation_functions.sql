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

-- Función para crear snapshots de usuarios
CREATE OR REPLACE FUNCTION create_user_snapshots()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
END;
$$;
