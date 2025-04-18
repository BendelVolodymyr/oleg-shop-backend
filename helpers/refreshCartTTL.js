const refreshCartTTL = cart => {
  // Якщо це гостьова корзина (без userId), оновлюємо час життя
  if (!cart.userId) {
    cart.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
  } else {
    cart.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
  }
};

export default refreshCartTTL;
