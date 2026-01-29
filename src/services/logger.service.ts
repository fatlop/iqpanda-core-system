import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RitualLog, SoulLog } from '../types/logs.types';

export class LoggerService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async logRitual(log: Omit<RitualLog, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase
      .from('ritual_logs')
      .insert({
        user_id: log.user_id,
        demo: log.demo,
        ritual_type: log.ritual_type,
        outcome: log.outcome,
        latency_ms: log.latency_ms,
        metadata: log.metadata || {}
      });

    if (error) {
      console.error('Error logging ritual:', error);
    }
  }

  async logSoul(log: Omit<SoulLog, 'id' | 'created_at'>): Promise<void> {
    const { error } = await this.supabase
      .from('soul_logs')
      .insert({
        user_id: log.user_id,
        event_type: log.event_type,
        metadata: log.metadata || {}
      });

    if (error) {
      console.error('Error logging soul event:', error);
    }
  }
}
