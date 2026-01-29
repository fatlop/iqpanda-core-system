import { Router, Request, Response } from 'express';
import { Orchestrator } from '../services/orchestrator';
import { OrchestatorRequest } from '../types/orchestrator.types';

const router = Router();
const orchestrator = new Orchestrator();

/**
 * POST /api/orchestrator/context
 * Obtener contexto de usuario para un demo específico
 */
router.post('/context', async (req: Request, res: Response) => {
  try {
    const { user_id, requesting_demo, need } = req.body;

    if (!user_id || !requesting_demo || !need) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Faltan parámetros requeridos: user_id, requesting_demo, need'
      });
    }

    const request: OrchestatorRequest = { requesting_demo, need };
    const context = await orchestrator.getContext(user_id, request);

    res.json({
      exito: true,
      mensaje: 'Contexto obtenido exitosamente',
      context
    });
  } catch (error: any) {
    res.status(500).json({
      exito: false,
      mensaje: `Error al obtener contexto: ${error.message}`
    });
  }
});

/**
 * GET /api/orchestrator/profiles
 * Listar los perfiles disponibles y sus criterios
 */
router.get('/profiles', (req: Request, res: Response) => {
  res.json({
    exito: true,
    perfiles: [
      {
        id: 'tecnico_activo',
        descripcion: 'Usuario con alta actividad en demos técnicos',
        criterios: 'Más de 10 interacciones en demos técnicos en 30 días'
      },
      {
        id: 'usuario_explorador',
        descripcion: 'Usuario probando diferentes demos',
        criterios: '3+ demos diferentes, 5+ interacciones totales'
      },
      {
        id: 'negocio_en_validacion',
        descripcion: 'Usuario enfocado en herramientas de negocio',
        criterios: '5+ interacciones en demos de negocio, 15+ totales'
      },
      {
        id: 'cliente_listo_para_conversion',
        descripcion: 'Usuario con alta actividad constante',
        criterios: '20+ interacciones totales, 10+ en demos de negocio'
      },
      {
        id: 'creativo_recurrente',
        descripcion: 'Usuario enfocado en demos creativos',
        criterios: '8+ interacciones en demos creativos'
      }
    ]
  });
});

export default router;
