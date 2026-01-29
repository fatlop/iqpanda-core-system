-- =========================================
-- RITUAL LOGS (Observabilidad Operativa)
-- =========================================
CREATE TABLE ritual_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  demo TEXT NOT NULL,
  ritual_type TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('completed', 'error', 'abandoned')),
  latency_ms INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ritual_logs_user ON ritual_logs(user_id);
CREATE INDEX idx_ritual_logs_created ON ritual_logs(created_at);
CREATE INDEX idx_ritual_logs_demo ON ritual_logs(demo);

COMMENT ON TABLE ritual_logs IS 'Telemetría efímera: retención 30 días';

-- =========================================
-- SOUL LOGS (Evolución Simbólica)
-- =========================================
CREATE TABLE soul_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_soul_logs_user ON soul_logs(user_id);
CREATE INDEX idx_soul_logs_event ON soul_logs(event_type);

COMMENT ON TABLE soul_logs IS 'Eventos significativos: cambios de estado, hitos, transformaciones';

-- =========================================
-- DAILY DEMO METRICS (Agregados)
-- =========================================
CREATE TABLE daily_demo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo TEXT NOT NULL,
  date DATE NOT NULL,
  interactions_count INTEGER NOT NULL DEFAULT 0,
  avg_latency NUMERIC,
  completion_rate NUMERIC,
  error_rate NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(demo, date)
);

CREATE INDEX idx_metrics_demo_date ON daily_demo_metrics(demo, date DESC);

COMMENT ON TABLE daily_demo_metrics IS 'Métricas agregadas por demo: retención 6-12 meses';

-- =========================================
-- USER ACTIVITY SNAPSHOTS
-- =========================================
CREATE TABLE user_activity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  demo TEXT NOT NULL,
  last_activity TIMESTAMPTZ NOT NULL,
  interactions_30d INTEGER NOT NULL DEFAULT 0,
  profile_classification TEXT,
  confidence NUMERIC DEFAULT 0.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, demo)
);

CREATE INDEX idx_snapshots_user ON user_activity_snapshots(user_id);
CREATE INDEX idx_snapshots_profile ON user_activity_snapshots(profile_classification);

COMMENT ON TABLE user_activity_snapshots IS 'Snapshots de actividad para clasificación: NO datos crudos';
