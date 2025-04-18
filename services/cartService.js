import cartModel from '../models/cartModel.js';

const findByCartAndUser = (cartId, userId) => {
  return Promise.all([
    cartModel.Cart.findOne({ cartId }),
    cartModel.Cart.findOne({ userId }),
  ]);
};

const queryCart = query => cartModel.Cart.findOne(query);

const getCart = () => cartModel.Cart.find();

const addCart = body => cartModel.Cart.create(body);

const updateCart = (id, body) =>
  cartModel.Cart.findByIdAndUpdate(id, body, { new: true });

export default { getCart, queryCart, addCart, updateCart, findByCartAndUser };
