import mongoose, { Schema, model } from 'mongoose';

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { versionKey: false, timestamps: true } // timestamps автоматично додає createdAt та updatedAt
);

// Забезпечуємо, що користувач не зможе додати один товар кілька разів
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const Favorite = model('Favorite', favoriteSchema);
