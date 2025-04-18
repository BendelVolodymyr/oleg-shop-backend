import cartService from '../services/cartService.js';

const mergeGuestCartMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const cartId = req.cookies?.cartId;

    if (!userId || !cartId) return next();

    const [guestCart, userCart] = await cartService.findByCartAndUser(
      cartId,
      userId
    );

    if (!guestCart) return next();

    if (!userCart) {
      guestCart.userId = userId;
      guestCart.cartId = undefined;

      await guestCart.save();
    } else {
      guestCart.items.forEach(guestItem => {
        const index = userCart.items.findIndex(userItem =>
          userItem.product.equals(guestItem.product)
        );

        if (index > -1) {
          userCart.items[index].quantity += guestItem.quantity;
        } else {
          userCart.items.push(guestItem);
        }
      });

      await userCart.save();
      await guestCart.deleteOne();
    }

    res.clearCookie('cartId');
    next();
  } catch (err) {
    console.error('Error merging guest cart:', err);
    next(); // Не блокуємо запит навіть якщо merge не вдалось
  }
};

export default mergeGuestCartMiddleware;
