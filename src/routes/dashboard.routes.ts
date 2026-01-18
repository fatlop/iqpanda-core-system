import { Router } from 'express';
import {
  getDashboard,
  getReporteVentas
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/', getDashboard);
router.get('/reporte-ventas', getReporteVentas);

export default router;
