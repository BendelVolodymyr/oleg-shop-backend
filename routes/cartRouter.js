import express from 'express';

const cartRouter = express.Router();

cartRouter.get('/');
cartRouter.post('/');
cartRouter.put('/:id');
cartRouter.delete('/:id');

export default cartRouter;
