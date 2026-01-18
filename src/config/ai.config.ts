/**
 * Configuración de parámetros para los servicios de IA
 * Centraliza valores que pueden ajustarse según el negocio
 */

export const AI_CONFIG = {
  // Panda AI - Análisis de datos históricos
  HISTORICAL_DAYS: {
    SHORT_TERM: 7,    // Para detección de stock-out
    MEDIUM_TERM: 30,  // Para análisis de patrones
    LONG_TERM: 90     // Para proyecciones
  },

  // Smart Pricing - Umbrales de demanda
  DEMAND_THRESHOLDS: {
    HIGH: 50,   // Unidades vendidas en 30 días
    MEDIUM: 20  // Unidades vendidas en 30 días
  },

  // Smart Pricing - Umbrales de tendencia
  TREND_THRESHOLDS: {
    GROWING: 15,      // % de crecimiento
    DECLINING: -15    // % de decrecimiento
  },

  // Smart Pricing - Factores de ajuste de precio
  PRICE_ADJUSTMENTS: {
    HIGH_DEMAND_GROWING: 1.15,      // +15%
    LOW_DEMAND_DECLINING: 0.85,     // -15%
    HIGH_DEMAND_DECLINING: 0.95,    // -5%
    MEDIUM_DEMAND_GROWING: 1.08,    // +8%
    MIN_CHANGE_THRESHOLD: 0.50      // Cambio mínimo para sugerir
  },

  // Predictor Financiero - Factores de optimización
  OPTIMIZATION_FACTORS: {
    STOCK_MANAGEMENT: 0.05,     // +5%
    PROMOTIONS: 0.08,           // +8%
    SMART_PRICING: 0.12,        // +12%
    LOYALTY_PROGRAM: 0.10       // +10%
  },

  // Predictor Financiero - Límites de proyección
  PROJECTION_LIMITS: {
    MIN_DAYS: 1,
    MAX_DAYS: 365
  },

  // Alertas - Umbrales críticos
  CRITICAL_THRESHOLDS: {
    STOCK_OUT_DAYS: 3,          // Días antes de agotamiento
    MIN_DATA_POINTS: 30,        // Mínimo de datos para alta confianza
    HIGH_CONFIDENCE_DAYS: 90    // Días de datos para confianza alta
  },

  // Patrones - Análisis de días de la semana
  PATTERN_ANALYSIS: {
    MIN_VARIANCE_PERCENT: 30    // % mínimo de diferencia para destacar patrón
  }
};

// Nombres legibles para días de la semana
export const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];
