import { Orchestrator } from '../services/orchestrator';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn()
      }))
    }))
  }))
}));

describe('Orchestrator Service', () => {
  let orchestrator: Orchestrator;

  beforeEach(() => {
    // Set up environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
    
    orchestrator = new Orchestrator();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Profile Classification', () => {
    it('should classify user as usuario_explorador when no data exists', async () => {
      // Mock empty snapshots response
      const mockSupabase = orchestrator['supabase'];
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      });

      const result = await orchestrator.getContext('test-user-id', {
        requesting_demo: 'test_demo',
        need: 'contexto_tecnico_usuario'
      });

      expect(result.user_profile).toBe('usuario_explorador');
      expect(result.confidence).toBe(0.3);
      expect(result.metadata?.reason).toBe('No activity data available');
    });

    it('should classify user as tecnico_activo with high tech interactions', async () => {
      const mockSnapshots = [
        {
          demo: 'diagnostico_mecanico',
          interactions_30d: 15,
          last_activity: new Date().toISOString()
        },
        {
          demo: 'analisis_electrico',
          interactions_30d: 8,
          last_activity: new Date().toISOString()
        }
      ];

      const mockSupabase = orchestrator['supabase'];
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockSnapshots,
            error: null
          })
        })
      });

      const result = await orchestrator.getContext('test-user-id', {
        requesting_demo: 'test_demo',
        need: 'contexto_tecnico_usuario'
      });

      expect(result.user_profile).toBe('tecnico_activo');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.metadata?.most_active_demo).toBe('diagnostico_mecanico');
    });

    it('should throw error when Supabase returns error', async () => {
      const mockSupabase = orchestrator['supabase'];
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      await expect(
        orchestrator.getContext('test-user-id', {
          requesting_demo: 'test_demo',
          need: 'contexto_tecnico_usuario'
        })
      ).rejects.toThrow('Error fetching user snapshots: Database error');
    });
  });

  describe('Confidence Calculation', () => {
    it('should increase confidence with more interactions', async () => {
      const mockSnapshotsLow = [
        {
          demo: 'test_demo',
          interactions_30d: 3,
          last_activity: new Date().toISOString()
        }
      ];

      const mockSnapshotsHigh = [
        {
          demo: 'test_demo',
          interactions_30d: 25,
          last_activity: new Date().toISOString()
        },
        {
          demo: 'another_demo',
          interactions_30d: 15,
          last_activity: new Date().toISOString()
        }
      ];

      const mockSupabase = orchestrator['supabase'];
      
      // First call with low interactions
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockSnapshotsLow,
            error: null
          })
        })
      });

      const resultLow = await orchestrator.getContext('test-user-id', {
        requesting_demo: 'test_demo',
        need: 'patron_uso'
      });

      // Second call with high interactions
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockSnapshotsHigh,
            error: null
          })
        })
      });

      const resultHigh = await orchestrator.getContext('test-user-id', {
        requesting_demo: 'test_demo',
        need: 'patron_uso'
      });

      expect(resultHigh.confidence).toBeGreaterThan(resultLow.confidence);
    });
  });
});
