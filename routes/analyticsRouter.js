import express from 'express';

// import validateBody from '../middlewares/validateBody.js';
import analyticsController from '../controllers/analyticsController.js';

const analyticsRouter = express.Router();

analyticsRouter.get('/', analyticsController.getAnalytics);

export default analyticsRouter;
