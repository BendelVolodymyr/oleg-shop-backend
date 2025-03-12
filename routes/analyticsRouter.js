import express from 'express';
/**
 * @swagger
 * /api/analytics/:
 *   get:
 *     summary: Отримати аналітику
 *     tags: [analytics]
 *     responses:
 *       200:
 *         description: Успішний запит. Повертає масив інфо ( допрацювати).
 */

// import validateBody from '../middlewares/validateBody.js';
import analyticsController from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/', analyticsController.getAnalytics);

export default analyticsRouter;
