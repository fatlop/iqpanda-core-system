import { Router } from 'express';
import {
  getInsightsPanda,
  getSugerenciasPrecio,
  getSugerenciaPrecioProducto,
  getProyeccionFinanciera
} from '../controllers/ai.controller';

const router = Router();

// Panda AI - Insights inteligentes
router.get('/panda', getInsightsPanda);

// Smart Pricing - Sugerencias de precios
router.get('/precios', getSugerenciasPrecio);
router.get('/precios/:id', getSugerenciaPrecioProducto);

// Predictor Financiero
router.get('/proyeccion', getProyeccionFinanciera);

export default router;
