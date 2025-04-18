import cartModel from '../models/cartModel.js';

const findByCartAndUser = (cartId, userId) => {
  return Promise.all([
    cartModel.Cart.findOne({ cartId }),
    cartModel.Cart.findOne({ userId }),
  ]);
};

const mergeGuestCart = async (cartId, userId) => {
  const [guestCart, userCart] = await findByCartAndUser(cartId, userId);

  if (!guestCart) return;

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
};

const queryCart = query => cartModel.Cart.findOne(query);

const getCart = () => cartModel.Cart.find();

const addCart = body => cartModel.Cart.create(body);

const updateCart = (id, body) =>
  cartModel.Cart.findByIdAndUpdate(id, body, { new: true });

export default {
  getCart,
  queryCart,
  addCart,
  updateCart,
  findByCartAndUser,
  mergeGuestCart,
};
