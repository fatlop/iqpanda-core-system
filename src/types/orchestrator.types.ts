export type UserProfile = 
  | 'tecnico_activo'
  | 'usuario_explorador'
  | 'negocio_en_validacion'
  | 'cliente_listo_para_conversion'
  | 'creativo_recurrente';

export interface OrchestatorRequest {
  requesting_demo: string;
  need: 'contexto_tecnico_usuario' | 'perfil_comercial' | 'patron_uso';
}

export interface OrchestatorResponse {
  user_profile: UserProfile;
  confidence: number;
  metadata?: {
    reason?: string;
    snapshots_count?: number;
    most_active_demo?: string;
  };
}
