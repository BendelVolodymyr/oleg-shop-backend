import HttpError from '../helpers/HttpError.js';
import productService from '../services/productService.js';
import cartService from '../services/cartService.js';

const checkCartStockMiddleware = async (req, res, next) => {
  try {
    const { productId, quantity, action } = req.body;

    if (!productId || typeof quantity !== 'number') {
      throw HttpError(
        400,
        'productId and quantity (type: number) are required'
      );
    }

    if (!['increment', 'decrement', 'set'].includes(action)) {
      throw HttpError(
        400,
        'Invalid action. Allowed actions are: increment, decrement, set'
      );
    }

    const product = await productService.controlIdProduct(productId);
    if (!product) {
      throw HttpError(404, 'Product not found');
    }

    const identifier = req.user?.id || req.cartId;
    const query = req.user ? { userId: identifier } : { cartId: identifier };
    const cart = await cartService.queryCart(query);

    if (!cart) {
      throw HttpError(404, 'Cart not found');
    }

    const cartItem = cart.items.find(item => item.product.equals(productId));
    const existingQuantity = cartItem ? cartItem.quantity : 0;

    let totalQuantity;

    if (action === 'increment') {
      totalQuantity = existingQuantity + quantity;
    }

    if (action === 'decrement') {
      totalQuantity = existingQuantity - quantity;

      if (totalQuantity < 0) {
        throw HttpError(400, 'Quantity cannot be less than 0');
      }
    }

    if (action === 'set') {
      totalQuantity = quantity;
    }

    if (totalQuantity > product.stock) {
      throw HttpError(
        400,
        `Only ${product.stock} item(s) available. You already have ${existingQuantity} in cart.`
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default checkCartStockMiddleware;
