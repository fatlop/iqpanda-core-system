import Sale from '../models/Sale.model';
import Product from '../models/Product.model';
import { logger } from '../config/logger';

/**
 * Servicio de IA Panda - Asesor Virtual Inteligente
 * Analiza patrones de ventas y proporciona insights accionables
 */

export interface PandaInsight {
  tipo: 'alerta' | 'sugerencia' | 'prediccion' | 'oportunidad';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  mensaje: string;
  accion?: string;
  impactoEstimado?: string;
  datos?: any;
}

/**
 * Analiza patrones de ventas por día de la semana
 */
export const analizarPatronesPorDia = async (): Promise<PandaInsight[]> => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const ventas = await Sale.find({
      fecha: { $gte: hace30Dias },
      estado: 'completada'
    });

    // Analizar ventas por día de la semana
    const ventasPorDia: { [key: number]: { total: number; monto: number } } = {};
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    ventas.forEach((venta: any) => {
      const dia = new Date(venta.fecha).getDay();
      if (!ventasPorDia[dia]) {
        ventasPorDia[dia] = { total: 0, monto: 0 };
      }
      ventasPorDia[dia].total++;
      ventasPorDia[dia].monto += venta.total;
    });

    const insights: PandaInsight[] = [];

    // Encontrar día con más ventas
    let mejorDia = 0;
    let maxVentas = 0;
    Object.keys(ventasPorDia).forEach(dia => {
      const diaNum = parseInt(dia);
      if (ventasPorDia[diaNum].total > maxVentas) {
        maxVentas = ventasPorDia[diaNum].total;
        mejorDia = diaNum;
      }
    });

    // Encontrar día con menos ventas
    let peorDia = 0;
    let minVentas = Infinity;
    Object.keys(ventasPorDia).forEach(dia => {
      const diaNum = parseInt(dia);
      if (ventasPorDia[diaNum].total < minVentas && ventasPorDia[diaNum].total > 0) {
        minVentas = ventasPorDia[diaNum].total;
        peorDia = diaNum;
      }
    });

    if (maxVentas > minVentas * 1.3) {
      const diferencia = Math.round(((maxVentas - minVentas) / minVentas) * 100);
      insights.push({
        tipo: 'sugerencia',
        prioridad: 'media',
        titulo: 'Patrón de ventas por día detectado',
        mensaje: `Noté que los ${diasSemana[mejorDia]} vendes ${diferencia}% más que los ${diasSemana[peorDia]}. ¿Qué tal si preparas más stock los días anteriores a ${diasSemana[mejorDia]}?`,
        accion: 'Optimizar preparación de inventario según día de la semana',
        impactoEstimado: `Podrías reducir ventas perdidas y aumentar ingresos hasta $${Math.round(ventasPorDia[mejorDia].monto * 0.15).toLocaleString('es-MX')} al mes`
      });
    }

    return insights;
  } catch (error) {
    logger.error('Error analizando patrones por día:', error);
    return [];
  }
};

/**
 * Detecta productos en riesgo de agotarse
 */
export const detectarRiesgoStockOut = async (): Promise<PandaInsight[]> => {
  try {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const ventas = await Sale.find({
      fecha: { $gte: hace7Dias },
      estado: 'completada'
    });

    // Calcular velocidad de venta por producto
    const ventasPorProducto: { [key: string]: { cantidad: number; nombre: string } } = {};

    ventas.forEach((venta: any) => {
      venta.items.forEach((item: any) => {
        const productoId = item.producto.toString();
        if (!ventasPorProducto[productoId]) {
          ventasPorProducto[productoId] = {
            cantidad: 0,
            nombre: item.nombreProducto
          };
        }
        ventasPorProducto[productoId].cantidad += item.cantidad;
      });
    });

    const insights: PandaInsight[] = [];

    // Verificar stock actual vs velocidad de venta
    for (const [productoId, datos] of Object.entries(ventasPorProducto)) {
      const producto = await Product.findById(productoId);
      if (!producto || !producto.activo) continue;

      const ventaDiaria = datos.cantidad / 7;
      const diasRestantes = producto.cantidadDisponible / ventaDiaria;

      if (diasRestantes < 3 && diasRestantes > 0) {
        insights.push({
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: `Stock crítico: ${datos.nombre}`,
          mensaje: `¡Atención! A este ritmo de ventas, te quedarás sin "${datos.nombre}" en aproximadamente ${Math.ceil(diasRestantes)} días. Solo tienes ${producto.cantidadDisponible} ${producto.unidadMedida} disponibles.`,
          accion: `Reabastecer ${datos.nombre} urgentemente`,
          impactoEstimado: `Evitarás perder aproximadamente ${Math.round(ventaDiaria * 3)} ventas`
        });
      }
    }

    return insights;
  } catch (error) {
    logger.error('Error detectando riesgo de stock-out:', error);
    return [];
  }
};

/**
 * Identifica productos estrella
 */
export const identificarProductosEstrella = async (): Promise<PandaInsight[]> => {
  try {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const topProductos = await Sale.aggregate([
      {
        $match: {
          fecha: { $gte: hace30Dias },
          estado: 'completada'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.producto',
          nombreProducto: { $first: '$items.nombreProducto' },
          cantidadVendida: { $sum: '$items.cantidad' },
          ingresoGenerado: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { ingresoGenerado: -1 } },
      { $limit: 3 }
    ]);

    const insights: PandaInsight[] = [];

    if (topProductos.length > 0) {
      const top1 = topProductos[0];
      insights.push({
        tipo: 'oportunidad',
        prioridad: 'alta',
        titulo: '⭐ Producto Estrella Detectado',
        mensaje: `"${top1.nombreProducto}" es tu producto más rentable. Ha generado $${top1.ingresoGenerado.toFixed(2)} en el último mes (${top1.cantidadVendida} unidades vendidas).`,
        accion: 'Considera crear promociones o combos con este producto',
        impactoEstimado: 'Podrías aumentar ventas hasta 25% con estrategia correcta',
        datos: topProductos
      });
    }

    return insights;
  } catch (error) {
    logger.error('Error identificando productos estrella:', error);
    return [];
  }
};

/**
 * Genera predicción de ventas para el día actual
 */
export const predecirVentasHoy = async (): Promise<PandaInsight> => {
  try {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    // Buscar ventas históricas del mismo día de la semana
    const ventasHistoricas = await Sale.find({
      fecha: { $gte: hace30Dias },
      estado: 'completada'
    });

    const ventasMismoDia = ventasHistoricas.filter((v: any) => {
      return new Date(v.fecha).getDay() === diaSemana;
    });

    if (ventasMismoDia.length === 0) {
      return {
        tipo: 'prediccion',
        prioridad: 'baja',
        titulo: 'Predicción del día',
        mensaje: 'Recopilando datos para generar predicciones más precisas...'
      };
    }

    const promedioVentas = ventasMismoDia.reduce((sum: number, v: any) => sum + v.total, 0) / ventasMismoDia.length;
    const cantidadPromedio = ventasMismoDia.length / 4; // Asumiendo 4 semanas

    return {
      tipo: 'prediccion',
      prioridad: 'media',
      titulo: '🔮 Predicción para hoy',
      mensaje: `Basándome en los últimos 30 días, hoy podrías vender aproximadamente $${promedioVentas.toFixed(2)} con alrededor de ${Math.round(cantidadPromedio)} transacciones.`,
      datos: {
        ventaEstimada: promedioVentas,
        transaccionesEstimadas: Math.round(cantidadPromedio),
        confianza: ventasMismoDia.length >= 4 ? 'alta' : 'media'
      }
    };
  } catch (error) {
    logger.error('Error prediciendo ventas:', error);
    return {
      tipo: 'prediccion',
      prioridad: 'baja',
      titulo: 'Predicción no disponible',
      mensaje: 'Necesito más datos para generar predicciones precisas'
    };
  }
};

/**
 * Obtiene todos los insights de Panda AI
 */
export const obtenerInsightsPanda = async (): Promise<PandaInsight[]> => {
  try {
    const [
      patronesDia,
      riesgoStock,
      productosEstrella,
      prediccionHoy
    ] = await Promise.all([
      analizarPatronesPorDia(),
      detectarRiesgoStockOut(),
      identificarProductosEstrella(),
      predecirVentasHoy()
    ]);

    return [
      prediccionHoy,
      ...riesgoStock,
      ...patronesDia,
      ...productosEstrella
    ];
  } catch (error) {
    logger.error('Error obteniendo insights de Panda:', error);
    return [];
  }
};
