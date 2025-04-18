import productService from '../services/productService.js';

export const calculateTotalPrice = async items => {
  let total = 0;

  for (const item of items) {
    const product = await productService.controlIdProduct(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  return total;
};
