import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard.controllers.ts';

const router = Router();

router.route("/").get(getDashboardOverview);


export default router;