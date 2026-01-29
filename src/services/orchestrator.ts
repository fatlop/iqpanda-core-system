import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrchestatorRequest, OrchestatorResponse, UserProfile } from '../types/orchestrator.types';

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

  async getContext(userId: string, _request: OrchestatorRequest): Promise<OrchestatorResponse> {
    // Consultar SOLO snapshots agregados (NO logs crudos)
    const { data: snapshots, error } = await this.supabase
      .from('user_activity_snapshots')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching user snapshots: ${error.message}`);
    }

    if (!snapshots || snapshots.length === 0) {
      return {
        user_profile: 'usuario_explorador',
        confidence: 0.3,
        metadata: {
          reason: 'No activity data available',
          snapshots_count: 0
        }
      };
    }

    // Clasificación basada en reglas (NO IA libre por ahora)
    const profile = this.classifyUser(snapshots);
    const confidence = this.calculateConfidence(snapshots);

    return {
      user_profile: profile,
      confidence,
      metadata: {
        snapshots_count: snapshots.length,
        most_active_demo: this.getMostActiveDemo(snapshots)
      }
    };
  }

  private classifyUser(snapshots: any[]): UserProfile {
    const techDemos = ['diagnostico_mecanico', 'analisis_electrico', 'auditoria_red'];
    const businessDemos = ['crm_inteligente', 'catalogos_digitales'];
    const creativeDemos = ['generador_branding', 'guiones_video'];

    const techInteractions = snapshots
      .filter(s => techDemos.includes(s.demo))
      .reduce((sum, s) => sum + s.interactions_30d, 0);

    const businessInteractions = snapshots
      .filter(s => businessDemos.includes(s.demo))
      .reduce((sum, s) => sum + s.interactions_30d, 0);

    const creativeInteractions = snapshots
      .filter(s => creativeDemos.includes(s.demo))
      .reduce((sum, s) => sum + s.interactions_30d, 0);

    const totalInteractions = techInteractions + businessInteractions + creativeInteractions;

    // Reglas de clasificación (enumeradas, NO improvisadas)
    if (techInteractions > 10 && techInteractions > businessInteractions * 2) {
      return 'tecnico_activo';
    }
    
    if (businessInteractions > 5 && totalInteractions > 15) {
      return 'negocio_en_validacion';
    }

    if (creativeInteractions > 8) {
      return 'creativo_recurrente';
    }

    if (totalInteractions > 20 && businessInteractions > 10) {
      return 'cliente_listo_para_conversion';
    }

    if (snapshots.length >= 3 && totalInteractions > 5) {
      return 'usuario_explorador';
    }

    return 'usuario_explorador';
  }

  private calculateConfidence(snapshots: any[]): number {
    const totalInteractions = snapshots.reduce((sum, s) => sum + s.interactions_30d, 0);
    const daysWithActivity = snapshots.filter(s => s.last_activity).length;

    // Confianza basada en volumen y consistencia
    let confidence = 0.3; // baseline

    if (totalInteractions > 20) confidence += 0.3;
    else if (totalInteractions > 10) confidence += 0.2;
    else if (totalInteractions > 5) confidence += 0.1;

    if (daysWithActivity > 5) confidence += 0.2;
    else if (daysWithActivity > 3) confidence += 0.1;

    if (snapshots.length > 3) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  private getMostActiveDemo(snapshots: any[]): string {
    if (snapshots.length === 0) return 'none';
    
    return snapshots.reduce((max, current) => 
      current.interactions_30d > max.interactions_30d ? current : max
    ).demo;
  }
}
