import { Request, Response } from 'express';
import Product from '../models/Product.model';
import { logger } from '../config/logger';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { categoria, buscar, activo } = req.query;
    
    const filtro: any = {};
    
    if (categoria) {
      filtro.categoria = categoria;
    }
    
    if (activo !== undefined) {
      filtro.activo = activo === 'true';
    }
    
    if (buscar) {
      filtro.$text = { $search: buscar as string };
    }
    
    const productos = await Product.find(filtro).sort({ fechaCreacion: -1 });
    
    res.json({
      exito: true,
      total: productos.length,
      productos
    });
  } catch (error: any) {
    logger.error('Error al obtener productos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el inventario'
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const producto = await Product.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      exito: true,
      producto
    });
  } catch (error: any) {
    logger.error('Error al obtener producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el producto'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const producto = new Product(req.body);
    await producto.save();
    
    logger.info(`Producto creado: ${producto.nombre} (${producto.codigo})`);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente',
      producto
    });
  } catch (error: any) {
    logger.error('Error al crear producto:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe un producto con ese código'
      });
    }
    
    res.status(400).json({
      exito: false,
      mensaje: error.message || 'Error al crear el producto'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    logger.info(`Producto actualizado: ${producto.nombre}`);
    
    res.json({
      exito: true,
      mensaje: 'Producto actualizado exitosamente',
      producto
    });
  } catch (error: any) {
    logger.error('Error al actualizar producto:', error);
    res.status(400).json({
      exito: false,
      mensaje: error.message || 'Error al actualizar el producto'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    logger.info(`Producto desactivado: ${producto.nombre}`);
    
    res.json({
      exito: true,
      mensaje: 'Producto desactivado exitosamente',
      producto
    });
  } catch (error: any) {
    logger.error('Error al desactivar producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al desactivar el producto'
    });
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const productos = await Product.find({
      activo: true,
      $expr: { $lte: ['$cantidadDisponible', '$cantidadMinima'] }
    }).sort({ cantidadDisponible: 1 });
    
    res.json({
      exito: true,
      total: productos.length,
      mensaje: productos.length > 0 
        ? `${productos.length} producto(s) con stock bajo` 
        : 'No hay productos con stock bajo',
      productos
    });
  } catch (error: any) {
    logger.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener productos con stock bajo'
    });
  }
};
