import { Router } from 'express';
import { getTrendingDashboardData, getTrendDetailsById } from '../controllers/trend.controllers.ts';
const router = Router();

router.route("/").get(getTrendingDashboardData);
router.route("/:id").get(getTrendDetailsById);

export default router;