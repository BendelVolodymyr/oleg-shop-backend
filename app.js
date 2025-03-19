import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import setupSwagger from './config/swaggerConfig.js';

import analyticsRouter from './routes/analyticsRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/usersRouter.js';
import productRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/ordersRouter.js';
import paymentRouter from './routes/paymentsRouter.js';
import reviewsRouter from './routes/reviewsRouter.js';
import shippingRouter from './routes/shippingRouter.js';
import adminRouter from './routes/adminRouter.js';

import socketService from './services/socket.js';

const { DB_HOST, PORT = 3001 } = process.env;
const app = express();
const server = http.createServer(app);

socketService.initSocket(server);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database successful');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}!`);
    });
  })
  .catch(error => {
    console.error('❌ Database connection failed', error);
    process.exit(1);
  });

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(
  express.urlencoded({
    extended: true,
    limit: '5mb',
    parameterLimit: 5000,
    type: 'application/x-www-form-urlencoded',
  })
);

app.get('/', (req, res, next) => {
  res.json({ message: 'CORS is activated' });
});

app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/shipping', shippingRouter);

setupSwagger(app);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});
