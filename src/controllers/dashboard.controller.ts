import { Request, Response } from 'express';
import Sale from '../models/Sale.model';
import Product from '../models/Product.model';
import { logger } from '../config/logger';
import { redondearADosDecimales } from '../utils/helpers';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { periodo = '30' } = req.query;
    const dias = parseInt(periodo as string);
    
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);
    
    // Estadísticas de ventas
    const ventas = await Sale.find({
      fecha: { $gte: fechaInicio },
      estado: 'completada'
    });
    
    const totalVentas = ventas.length;
    const ingresoTotal = ventas.reduce((sum, venta) => sum + venta.total, 0);
    const promedioVenta = totalVentas > 0 ? ingresoTotal / totalVentas : 0;
    
    // Productos más vendidos
    const productosMasVendidos = await Sale.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio },
          estado: 'completada'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.nombreProducto',
          cantidadVendida: { $sum: '$items.cantidad' },
          ingresoGenerado: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: 5 }
    ]);
    
    // Inventario
    const totalProductos = await Product.countDocuments({ activo: true });
    const productosStockBajo = await Product.countDocuments({
      activo: true,
      $expr: { $lte: ['$cantidadDisponible', '$cantidadMinima'] }
    });
    
    const valorInventario = await Product.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$precio', '$cantidadDisponible'] } }
        }
      }
    ]);
    
    // Ventas por método de pago
    const ventasPorMetodoPago = await Sale.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio },
          estado: 'completada'
        }
      },
      {
        $group: {
          _id: '$metodoPago',
          cantidad: { $sum: 1 },
          total: { $sum: '$total' }
        }
      }
    ]);
    
    // Ventas por día (últimos 7 días)
    const ventasPorDia = await Sale.aggregate([
      {
        $match: {
          fecha: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          estado: 'completada'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
          cantidad: { $sum: 1 },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      exito: true,
      periodo: `Últimos ${dias} días`,
      resumen: {
        ventas: {
          total: totalVentas,
          ingresoTotal: redondearADosDecimales(ingresoTotal),
          promedio: redondearADosDecimales(promedioVenta)
        },
        inventario: {
          totalProductos,
          productosStockBajo,
          valorTotal: valorInventario.length > 0 
            ? redondearADosDecimales(valorInventario[0].total)
            : 0
        }
      },
      detalles: {
        productosMasVendidos,
        ventasPorMetodoPago,
        ventasPorDia
      }
    });
  } catch (error: any) {
    logger.error('Error al obtener dashboard:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el tablero de control'
    });
  }
};

export const getReporteVentas = async (req: Request, res: Response) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Se requieren fechas de inicio y fin para el reporte'
      });
    }
    
    const ventas = await Sale.find({
      fecha: {
        $gte: new Date(fechaInicio as string),
        $lte: new Date(fechaFin as string)
      },
      estado: 'completada'
    }).populate('items.producto');
    
    const totalVentas = ventas.length;
    const ingresoTotal = ventas.reduce((sum, venta) => sum + venta.total, 0);
    const descuentosTotal = ventas.reduce((sum, venta) => sum + venta.descuento, 0);
    const impuestosTotal = ventas.reduce((sum, venta) => sum + venta.impuestos, 0);
    
    res.json({
      exito: true,
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin
      },
      resumen: {
        totalVentas,
        ingresoTotal: redondearADosDecimales(ingresoTotal),
        descuentosTotal: redondearADosDecimales(descuentosTotal),
        impuestosTotal: redondearADosDecimales(impuestosTotal),
        promedioVenta: totalVentas > 0 
          ? redondearADosDecimales(ingresoTotal / totalVentas)
          : 0
      },
      ventas
    });
  } catch (error: any) {
    logger.error('Error al generar reporte:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al generar el reporte'
    });
  }
};
