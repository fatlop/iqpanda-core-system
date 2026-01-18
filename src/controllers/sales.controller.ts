import { Request, Response } from 'express';
import Sale from '../models/Sale.model';
import Product from '../models/Product.model';
import { logger } from '../config/logger';

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const { fechaInicio, fechaFin, estado, cliente } = req.query;
    
    const filtro: any = {};
    
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) {
        filtro.fecha.$gte = new Date(fechaInicio as string);
      }
      if (fechaFin) {
        filtro.fecha.$lte = new Date(fechaFin as string);
      }
    }
    
    if (estado) {
      filtro.estado = estado;
    }
    
    if (cliente) {
      filtro.$text = { $search: cliente as string };
    }
    
    const ventas = await Sale.find(filtro)
      .populate('items.producto')
      .sort({ fecha: -1 })
      .limit(100);
    
    res.json({
      exito: true,
      total: ventas.length,
      ventas
    });
  } catch (error: any) {
    logger.error('Error al obtener ventas:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener las ventas'
    });
  }
};

export const getSale = async (req: Request, res: Response) => {
  try {
    const venta = await Sale.findById(req.params.id).populate('items.producto');
    
    if (!venta) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Venta no encontrada'
      });
    }
    
    res.json({
      exito: true,
      venta
    });
  } catch (error: any) {
    logger.error('Error al obtener venta:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener la venta'
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const { items, cliente, metodoPago, descuento = 0, impuestos = 0, notas } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La venta debe tener al menos un producto'
      });
    }
    
    // Verificar disponibilidad de productos
    const itemsConDetalles = [];
    let subtotal = 0;
    
    for (const item of items) {
      const producto = await Product.findById(item.producto);
      
      if (!producto) {
        return res.status(404).json({
          exito: false,
          mensaje: `Producto no encontrado: ${item.producto}`
        });
      }
      
      if (!producto.activo) {
        return res.status(400).json({
          exito: false,
          mensaje: `El producto ${producto.nombre} no está disponible`
        });
      }
      
      if (producto.cantidadDisponible < item.cantidad) {
        return res.status(400).json({
          exito: false,
          mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidadDisponible}`
        });
      }
      
      const itemSubtotal = producto.precio * item.cantidad;
      subtotal += itemSubtotal;
      
      itemsConDetalles.push({
        producto: producto._id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: itemSubtotal
      });
    }
    
    const total = subtotal - descuento + impuestos;
    
    // Generar número de venta
    const fechaActual = new Date();
    const numeroVenta = `V-${fechaActual.getFullYear()}${String(fechaActual.getMonth() + 1).padStart(2, '0')}${String(fechaActual.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
    
    const venta = new Sale({
      numeroVenta,
      fecha: fechaActual,
      cliente,
      items: itemsConDetalles,
      subtotal,
      descuento,
      impuestos,
      total,
      metodoPago,
      estado: 'completada',
      notas
    });
    
    await venta.save();
    
    // Actualizar inventario
    for (const item of itemsConDetalles) {
      await Product.findByIdAndUpdate(
        item.producto,
        { $inc: { cantidadDisponible: -item.cantidad } }
      );
    }
    
    logger.info(`Venta creada: ${numeroVenta} - Total: $${total}`);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Venta registrada exitosamente',
      venta
    });
  } catch (error: any) {
    logger.error('Error al crear venta:', error);
    res.status(400).json({
      exito: false,
      mensaje: error.message || 'Error al registrar la venta'
    });
  }
};

export const cancelSale = async (req: Request, res: Response) => {
  try {
    const venta = await Sale.findById(req.params.id);
    
    if (!venta) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Venta no encontrada'
      });
    }
    
    if (venta.estado === 'cancelada') {
      return res.status(400).json({
        exito: false,
        mensaje: 'La venta ya está cancelada'
      });
    }
    
    venta.estado = 'cancelada';
    await venta.save();
    
    // Revertir inventario
    for (const item of venta.items) {
      await Product.findByIdAndUpdate(
        item.producto,
        { $inc: { cantidadDisponible: item.cantidad } }
      );
    }
    
    logger.info(`Venta cancelada: ${venta.numeroVenta}`);
    
    res.json({
      exito: true,
      mensaje: 'Venta cancelada exitosamente',
      venta
    });
  } catch (error: any) {
    logger.error('Error al cancelar venta:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cancelar la venta'
    });
  }
};
