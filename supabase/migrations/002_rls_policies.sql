-- Habilitar RLS
ALTER TABLE ritual_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_demo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_snapshots ENABLE ROW LEVEL SECURITY;

-- Políticas para ritual_logs
CREATE POLICY "Users can only read their own ritual logs"
  ON ritual_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all ritual logs"
  ON ritual_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para soul_logs
CREATE POLICY "Users can only read their own soul logs"
  ON soul_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all soul logs"
  ON soul_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para daily_demo_metrics (lectura pública de agregados)
CREATE POLICY "Anyone can read demo metrics"
  ON daily_demo_metrics FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage metrics"
  ON daily_demo_metrics FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para user_activity_snapshots
CREATE POLICY "Users can only read their own snapshots"
  ON user_activity_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all snapshots"
  ON user_activity_snapshots FOR ALL
  USING (auth.role() = 'service_role');
