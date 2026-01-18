import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  nombre: string;
  descripcion: string;
  codigo: string;
  categoria: string;
  precio: number;
  cantidadDisponible: number;
  cantidadMinima: number;
  unidadMedida: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const ProductSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      trim: true,
      default: ''
    },
    codigo: {
      type: String,
      required: [true, 'El código del producto es obligatorio'],
      unique: true,
      trim: true
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    cantidadDisponible: {
      type: Number,
      required: [true, 'La cantidad disponible es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0
    },
    cantidadMinima: {
      type: Number,
      default: 0,
      min: [0, 'La cantidad mínima no puede ser negativa']
    },
    unidadMedida: {
      type: String,
      required: [true, 'La unidad de medida es obligatoria'],
      trim: true,
      default: 'unidad'
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    }
  }
);

ProductSchema.index({ nombre: 'text', descripcion: 'text', codigo: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
