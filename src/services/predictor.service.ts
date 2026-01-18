import Sale from '../models/Sale.model';
import Product from '../models/Product.model';
import { logger } from '../config/logger';
import { redondearADosDecimales } from '../utils/helpers';

/**
 * Servicio de Predicción Financiera
 * Proyecta ventas futuras y genera escenarios optimizados
 */

export interface ProyeccionFinanciera {
  periodo: {
    inicio: Date;
    fin: Date;
    dias: number;
  };
  escenarioActual: {
    ventasEstimadas: number;
    transaccionesEstimadas: number;
    crecimientoEstimado: number;
    riesgos: string[];
  };
  escenarioOptimizado: {
    ventasEstimadas: number;
    transaccionesEstimadas: number;
    crecimientoEstimado: number;
    gananciaExtra: number;
    cambiosSugeridos: Array<{
      tipo: string;
      descripcion: string;
      impacto: string;
    }>;
  };
  confianza: 'alta' | 'media' | 'baja';
}

/**
 * Genera proyección financiera para los próximos N días
 */
export const generarProyeccion = async (dias: number = 30): Promise<ProyeccionFinanciera> => {
  try {
    const hoy = new Date();
    const finProyeccion = new Date();
    finProyeccion.setDate(finProyeccion.getDate() + dias);

    // Obtener datos históricos
    const hace90Dias = new Date();
    hace90Dias.setDate(hace90Dias.getDate() - 90);

    const ventasHistoricas = await Sale.find({
      fecha: { $gte: hace90Dias },
      estado: 'completada'
    });

    if (ventasHistoricas.length === 0) {
      return {
        periodo: {
          inicio: hoy,
          fin: finProyeccion,
          dias
        },
        escenarioActual: {
          ventasEstimadas: 0,
          transaccionesEstimadas: 0,
          crecimientoEstimado: 0,
          riesgos: ['Datos insuficientes para generar proyección']
        },
        escenarioOptimizado: {
          ventasEstimadas: 0,
          transaccionesEstimadas: 0,
          crecimientoEstimado: 0,
          gananciaExtra: 0,
          cambiosSugeridos: []
        },
        confianza: 'baja'
      };
    }

    // Calcular promedios
    const ventasDiarias = ventasHistoricas.reduce((sum: number, v: any) => sum + v.total, 0) / 90;
    const transaccionesDiarias = ventasHistoricas.length / 90;

    // Calcular tendencia (últimos 30 días vs 30-60 días atrás)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    const hace60Dias = new Date();
    hace60Dias.setDate(hace60Dias.getDate() - 60);

    const ventasUltimos30 = ventasHistoricas.filter((v: any) => v.fecha >= hace30Dias);
    const ventas30a60 = ventasHistoricas.filter((v: any) => v.fecha >= hace60Dias && v.fecha < hace30Dias);

    const promedioUltimos30 = ventasUltimos30.reduce((sum: number, v: any) => sum + v.total, 0) / 30;
    const promedio30a60 = ventas30a60.reduce((sum: number, v: any) => sum + v.total, 0) / 30;

    const tendencia = promedio30a60 > 0 
      ? ((promedioUltimos30 - promedio30a60) / promedio30a60) * 100 
      : 0;

    // Escenario actual (sin cambios)
    const ventasEstimadasActual = redondearADosDecimales(ventasDiarias * dias);
    const transaccionesEstimadas = Math.round(transaccionesDiarias * dias);
    const crecimientoActual = redondearADosDecimales(tendencia);

    // Identificar riesgos
    const riesgos: string[] = [];
    const productosConStockBajo = await Product.countDocuments({
      activo: true,
      $expr: { $lte: ['$cantidadDisponible', '$cantidadMinima'] }
    });

    if (productosConStockBajo > 0) {
      riesgos.push(`${productosConStockBajo} producto(s) con stock bajo podrían causar ventas perdidas`);
    }

    if (tendencia < -5) {
      riesgos.push('Tendencia de ventas a la baja detectada');
    }

    // Escenario optimizado (con sugerencias aplicadas)
    const cambiosSugeridos = [];
    let factorOptimizacion = 1.0;

    // Sugerencia 1: Optimizar stock
    if (productosConStockBajo > 0) {
      cambiosSugeridos.push({
        tipo: 'Inventario',
        descripcion: `Reabastecer ${productosConStockBajo} producto(s) con stock bajo`,
        impacto: '+5% en ventas al evitar stock-outs'
      });
      factorOptimizacion += 0.05;
    }

    // Sugerencia 2: Promociones en días flojos
    cambiosSugeridos.push({
      tipo: 'Marketing',
      descripcion: 'Implementar promociones estratégicas en días de baja demanda',
      impacto: '+8% en ventas en días valle'
    });
    factorOptimizacion += 0.08;

    // Sugerencia 3: Optimizar precios
    cambiosSugeridos.push({
      tipo: 'Precios',
      descripcion: 'Aplicar sugerencias de Smart Pricing para productos clave',
      impacto: '+12% en margen sin afectar volumen'
    });
    factorOptimizacion += 0.12;

    // Sugerencia 4: Fidelización
    if (transaccionesEstimadas > 50) {
      cambiosSugeridos.push({
        tipo: 'Clientes',
        descripcion: 'Programa de lealtad para clientes frecuentes',
        impacto: '+10% en frecuencia de compra'
      });
      factorOptimizacion += 0.10;
    }

    const ventasEstimadasOptimizado = redondearADosDecimales(ventasDiarias * dias * factorOptimizacion);
    const gananciaExtra = redondearADosDecimales(ventasEstimadasOptimizado - ventasEstimadasActual);
    const crecimientoOptimizado = redondearADosDecimales(((factorOptimizacion - 1) * 100) + crecimientoActual);

    // Determinar confianza
    let confianza: 'alta' | 'media' | 'baja' = 'media';
    if (ventasHistoricas.length >= 90) confianza = 'alta';
    else if (ventasHistoricas.length < 30) confianza = 'baja';

    return {
      periodo: {
        inicio: hoy,
        fin: finProyeccion,
        dias
      },
      escenarioActual: {
        ventasEstimadas: ventasEstimadasActual,
        transaccionesEstimadas,
        crecimientoEstimado: crecimientoActual,
        riesgos: riesgos.length > 0 ? riesgos : ['Sin riesgos significativos detectados']
      },
      escenarioOptimizado: {
        ventasEstimadas: ventasEstimadasOptimizado,
        transaccionesEstimadas: Math.round(transaccionesEstimadas * factorOptimizacion),
        crecimientoEstimado: crecimientoOptimizado,
        gananciaExtra,
        cambiosSugeridos
      },
      confianza
    };
  } catch (error) {
    logger.error('Error generando proyección financiera:', error);
    throw error;
  }
};
