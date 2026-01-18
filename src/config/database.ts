import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iqpanda-core';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✓ Conectado exitosamente a la base de datos');
  } catch (error) {
    logger.error('✗ Error al conectar a la base de datos:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('Base de datos desconectada');
});

mongoose.connection.on('error', (error) => {
  logger.error('Error en la conexión de base de datos:', error);
});
