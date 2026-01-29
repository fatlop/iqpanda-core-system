export interface RitualLog {
  id: string;
  user_id: string;
  demo: string;
  ritual_type: string;
  outcome: 'completed' | 'error' | 'abandoned';
  latency_ms?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SoulLog {
  id: string;
  user_id: string;
  event_type: string;
  metadata?: Record<string, any>;
  created_at: string;
}
