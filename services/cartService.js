import { Cart } from '../models/cartModel';

const getCart = () => Cart.find();

const addCart = body => Cart.create(body);

const updateCart = (id, body) =>
  Cart.findByIdAndUpdate(id, body, { new: true });

export default { getCart };
