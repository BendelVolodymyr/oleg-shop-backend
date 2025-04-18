import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import refreshCartTTL from '../helpers/refreshCartTTL.js';
import cartService from '../services/cartService.js';
import productService from '../services/productService.js';

const allCart = async (req, res, next) => {
  //допрацювати пошук по юзеру
  const result = await allCart();
  if (!result || result.length === 0) {
    throw HttpError(404, 'No cart found');
  }
  res.status(201).json(result);
};

const updateCartItem = async (req, res, next) => {
  const identifier = req.user?.id || req.cartId;
  const query = req.user ? { userId: identifier } : { cartId: identifier };

  const { productId, quantity = 1, action = 'increment' } = req.body;

  if (!productId || typeof quantity !== 'number') {
    throw HttpError(400, 'productId and quantity(type: number) required');
  }

  if (!['increment', 'decrement', 'set'].includes(action)) {
    throw HttpError(
      400,
      'Invalid action. Use "increment", "decrement" or "set"'
    );
  }

  let cart = await cartService.queryCart(query);

  if (!cart) {
    if (quantity <= 0) {
      throw HttpError(400, 'Quantity must be greater than 0 for new item');
    }

    const newCart = {
      items: [{ product: productId, quantity }],
    };

    if (req.user?.id) {
      newCart.userId = req.user.id;
    } else {
      newCart.cartId = req.cartId;
    }

    cart = await cartService.addCart(newCart);
  } else {
    const itemIndex = cart.items.findIndex(item =>
      item.product.equals(productId)
    );

    if (itemIndex > -1) {
      let currentQty = cart.items[itemIndex].quantity;

      if (action === 'increment') {
        cart.items[itemIndex].quantity = currentQty + quantity;
      } else if (action === 'decrement') {
        const newQty = currentQty - quantity;
        if (newQty > 0) {
          cart.items[itemIndex].quantity = newQty;
        } else {
          cart.items.splice(itemIndex, 1);
        }
      } else if (action === 'set') {
        if (quantity > 0) {
          cart.items[itemIndex].quantity = quantity;
        } else {
          cart.items.splice(itemIndex, 1);
        }
      }
    } else {
      if (action === 'decrement') {
        throw HttpError(
          400,
          'Cannot decrement a product that does not exist in cart'
        );
      }
      if ((action === 'increment' || action === 'set') && quantity > 0) {
        cart.items.push({ product: productId, quantity });
      }
    }
  }

  refreshCartTTL(cart);
  await cart.save();

  res.status(200).json(cart);
};

const addCart = async (req, res) => {
  const identifier = req.user?.id || req.cartId;
  const query = req.user ? { userId: identifier } : { cartId: req.cartId };
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== 'number') {
    throw HttpError(400, 'productId and quantity (type: number) are required');
  }

  const product = await productService.controlIdProduct(productId);
  if (!product) throw HttpError(404, 'Product not found');

  const cart = await cartService.queryCart(query);
  if (!cart) throw HttpError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex(item =>
    item.product.equals(productId)
  );

  if (itemIndex === -1) {
    throw HttpError(404, 'Product not found in cart');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  refreshCartTTL(cart);
  await cart.save();

  res.status(200).json(cart);
};

const deleteCartItem = async (req, res, next) => {
  const productId = req.params.id; // <-- тут ми очікуємо productId, не _id з cart.items
  const identifier = req.user?.id || req.cartId;
  const query = req.user ? { userId: identifier } : { cartId: identifier };

  const cart = await cartService.queryCart(query);
  if (!cart) throw HttpError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex(item =>
    item.product.equals(productId)
  );
  if (itemIndex === -1) {
    throw HttpError(404, 'Product not found in cart');
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  res.status(200).json({ message: 'Product removed from cart', cart });
};

export default {
  allCart: ctrlWrapper(allCart),
  addCart: ctrlWrapper(addCart),
  updateCartItem: ctrlWrapper(updateCartItem),
  deleteCartItem: ctrlWrapper(deleteCartItem),
};
