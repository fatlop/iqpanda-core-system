import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleItem {
  producto: mongoose.Types.ObjectId;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ISale extends Document {
  numeroVenta: string;
  fecha: Date;
  cliente: {
    nombre: string;
    documento?: string;
    telefono?: string;
    email?: string;
  };
  items: ISaleItem[];
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  metodoPago: string;
  estado: string;
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const SaleSchema: Schema = new Schema(
  {
    numeroVenta: {
      type: String,
      required: [true, 'El número de venta es obligatorio'],
      unique: true
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
      default: Date.now
    },
    cliente: {
      nombre: {
        type: String,
        required: [true, 'El nombre del cliente es obligatorio'],
        trim: true
      },
      documento: {
        type: String,
        trim: true
      },
      telefono: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    items: [{
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      nombreProducto: {
        type: String,
        required: true
      },
      cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [1, 'La cantidad debe ser al menos 1']
      },
      precioUnitario: {
        type: Number,
        required: [true, 'El precio unitario es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
      },
      subtotal: {
        type: Number,
        required: true
      }
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    descuento: {
      type: Number,
      default: 0,
      min: 0
    },
    impuestos: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    metodoPago: {
      type: String,
      required: [true, 'El método de pago es obligatorio'],
      enum: ['efectivo', 'tarjeta', 'transferencia', 'otro']
    },
    estado: {
      type: String,
      required: true,
      enum: ['completada', 'pendiente', 'cancelada'],
      default: 'completada'
    },
    notas: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: {
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    }
  }
);

SaleSchema.index({ numeroVenta: 1 });
SaleSchema.index({ fecha: -1 });
SaleSchema.index({ 'cliente.nombre': 'text' });

export default mongoose.model<ISale>('Sale', SaleSchema);
