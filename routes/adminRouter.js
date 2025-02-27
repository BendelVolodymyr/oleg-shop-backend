import express from 'express';

import adminController from '../controllers/adminController.js';
import validateBody from '../middlewares/validateBody.js';
import { validateAdmin } from '../models/adminModel.js';

import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const adminRouter = express.Router();

adminRouter.post(
  '/register',
  adminAuthMiddleware,
  checkRole,
  validateBody(validateAdmin.joiAdminSchema),
  adminController.registerAdmin
);
adminRouter.post(
  '/login',
  validateBody(validateAdmin.joiAdminSchema),
  adminController.loginAdmin
);
adminRouter.post('/logout', adminAuthMiddleware, adminController.logout);
export default adminRouter;
