import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import cartService from '../services/cartService.js';

const allCart = async (req, res, next) => {
  //допрацювати пошук по юзеру
  const result = await allCart();
  if (!result || result.length === 0) {
    throw HttpError(404, 'No cart found');
  }
  res.status(201).json(result);
};

const addCart = async (req, res, next) => {
  const identifier = req.user?.id || req.cartId;
  const query = req.user ? { userId: identifier } : { cartId: identifier };

  const { productId, quantity } = req.body;

  let cart = await cartService.queryCart(query);

  if (!cart) {
    const newCart = {
      items: [{ product: productId, quantity }],
    };

    if (req.user?.id) {
      newCart.userId = req.user.id;
    } else {
      newCart.cartId = req.cartId;
    }
    console.log(newCart);
    cart = await cartService.addCart(newCart);
  } else {
    const itemIndex = cart.items.findIndex(item =>
      item.product.equals(productId)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();

  res.status(200).json(cart);
};

const updateCart = async (req, res, next) => {};

const deleteCart = async (req, res, next) => {};

export default {
  allCart: ctrlWrapper(allCart),
  addCart: ctrlWrapper(addCart),
  updateCart: ctrlWrapper(updateCart),
  deleteCart: ctrlWrapper(deleteCart),
};
