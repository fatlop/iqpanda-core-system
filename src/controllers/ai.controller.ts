import { Request, Response } from 'express';
import { obtenerInsightsPanda } from '../services/pandaAI.service';
import { generarSugerenciasPrecio, sugerirPrecioProducto } from '../services/smartPricing.service';
import { generarProyeccion } from '../services/predictor.service';
import { logger } from '../config/logger';
import { AI_CONFIG } from '../config/ai.config';

/**
 * Obtiene insights inteligentes de Panda AI
 */
export const getInsightsPanda = async (req: Request, res: Response) => {
  try {
    const insights = await obtenerInsightsPanda();

    res.json({
      exito: true,
      mensaje: '🐼 Panda AI ha analizado tu negocio',
      totalInsights: insights.length,
      insights
    });
  } catch (error: any) {
    logger.error('Error obteniendo insights de Panda AI:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener insights de Panda AI'
    });
  }
};

/**
 * Obtiene sugerencias de precios inteligentes para todos los productos
 */
export const getSugerenciasPrecio = async (req: Request, res: Response) => {
  try {
    const sugerencias = await generarSugerenciasPrecio();

    res.json({
      exito: true,
      mensaje: '💡 Smart Pricing ha analizado tus productos',
      totalSugerencias: sugerencias.length,
      sugerencias
    });
  } catch (error: any) {
    logger.error('Error obteniendo sugerencias de precio:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al generar sugerencias de precio'
    });
  }
};

/**
 * Obtiene sugerencia de precio para un producto específico
 */
export const getSugerenciaPrecioProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sugerencia = await sugerirPrecioProducto(id);

    if (!sugerencia) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado o no activo'
      });
    }

    res.json({
      exito: true,
      mensaje: '💡 Análisis de precio completado',
      sugerencia
    });
  } catch (error: any) {
    logger.error('Error obteniendo sugerencia de precio:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al generar sugerencia de precio'
    });
  }
};

/**
 * Genera proyección financiera para los próximos días
 */
export const getProyeccionFinanciera = async (req: Request, res: Response) => {
  try {
    const dias = parseInt(req.query.dias as string) || AI_CONFIG.HISTORICAL_DAYS.MEDIUM_TERM;

    if (dias < AI_CONFIG.PROJECTION_LIMITS.MIN_DAYS || dias > AI_CONFIG.PROJECTION_LIMITS.MAX_DAYS) {
      return res.status(400).json({
        exito: false,
        mensaje: `El período debe estar entre ${AI_CONFIG.PROJECTION_LIMITS.MIN_DAYS} y ${AI_CONFIG.PROJECTION_LIMITS.MAX_DAYS} días`
      });
    }

    const proyeccion = await generarProyeccion(dias);

    res.json({
      exito: true,
      mensaje: `🔮 Proyección financiera generada para los próximos ${dias} días`,
      proyeccion
    });
  } catch (error: any) {
    logger.error('Error generando proyección financiera:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al generar proyección financiera'
    });
  }
};
