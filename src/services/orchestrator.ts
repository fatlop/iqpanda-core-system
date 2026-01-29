import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrchestratorRequest, OrchestratorResponse, UserProfile } from '../types/orchestrator.types';

export class Orchestrator {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getContext(userId: string, _request: OrchestratorRequest): Promise<OrchestratorResponse> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Consultar SOLO snapshots con perfil YA CALCULADO
    const { data: snapshots, error } = await this.supabase
      .from('user_activity_snapshots')
      .select('profile_classification, confidence, demo, interactions_30d, last_activity')
      .eq('user_id', userId)
      .not('profile_classification', 'is', null);

    if (error) {
      throw new Error(`Error fetching user snapshots: ${error.message}`);
    }

    if (!snapshots || snapshots.length === 0) {
      // No snapshots with profile_classification found
      // This can happen if user has no activity or aggregation hasn't run yet
      return {
        user_profile: 'usuario_explorador',
        confidence: 0.3, // Baseline confidence matching SQL calculation
        metadata: {
          reason: 'No activity data available',
          snapshots_count: 0
        }
      };
    }

    // Todos los snapshots del mismo usuario tienen el mismo profile_classification
    // (se calcula una vez por usuario en la función SQL)
    const primarySnapshot = snapshots[0];

    return {
      user_profile: primarySnapshot.profile_classification as UserProfile,
      confidence: primarySnapshot.confidence || 0.3, // Fallback to baseline if null
      metadata: {
        snapshots_count: snapshots.length,
        most_active_demo: this.getMostActiveDemo(snapshots)
      }
    };
  }

  private getMostActiveDemo(snapshots: Array<{ demo: string; interactions_30d: number }>): string {
    if (snapshots.length === 0) return 'none';
    
    return snapshots.reduce((max, current) => 
      current.interactions_30d > max.interactions_30d ? current : max
    ).demo;
  }
}
