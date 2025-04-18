import { v4 as uuidv4 } from 'uuid';

const { NODE_ENV } = process.env;

const guestCartMiddleware = (req, res, next) => {
  if (!req.cookies.cartId) {
    const cartId = uuidv4();

    res.cookie('cartId', cartId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
    });
    req.cartId = cartId;
  } else {
    req.cartId = req.cookies.cartId;
  }
  next();
};

export default guestCartMiddleware;
