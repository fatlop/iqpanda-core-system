import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import salesRoutes from './routes/sales.routes';
import inventoryRoutes from './routes/inventory.routes';
import dashboardRoutes from './routes/dashboard.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Rate limiting para prevenir abuso de la API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: {
    exito: false,
    mensaje: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    nombre: 'IQpanda Core System',
    descripcion: '🐼 Sistema administrativo con IA para tu negocio',
    version: '2.0.0',
    estado: 'activo',
    nuevasCaracteristicas: [
      '🧠 Panda AI - Asesor Virtual Inteligente',
      '💰 Smart Pricing - Precios Inteligentes',
      '🔮 Predictor Financiero',
      '📊 Dashboard con Insights en Tiempo Real'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    estado: 'saludable',
    fecha: new Date().toISOString()
  });
});

app.use('/api/ventas', salesRoutes);
app.use('/api/inventario', inventoryRoutes);
app.use('/api/tablero', dashboardRoutes);
app.use('/api/ia', aiRoutes);

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.message);
  res.status(err.status || 500).json({
    error: true,
    mensaje: err.message || 'Error interno del servidor'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`Servidor IQpanda Core System escuchando en puerto ${PORT}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
