import mongoose, { model, Schema } from 'mongoose';
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const userAnalyticsSchema = new Schema(
  {
    timestamp: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      required: true,
    },
    os: { type: String, required: true },
    browser: { type: String, required: true },
    language: { type: String, required: true },
    ipAddress: { type: String, required: true },
    location: {
      country: { type: String },
      city: { type: String },
    },
    referralSource: { type: String },
    registrationMethod: {
      type: String,
      enum: ['email', 'google', 'facebook'],
      required: true,
    },
  },
  {
    timeseries: {
      timeField: 'timestamp', // це поле для часу
      granularity: 'seconds', // або інша величина в залежності від вашої потреби
    },
    versionKey: false,
    timestamps: true,
  }
);

userAnalyticsSchema.post('save', handleMongooseError);

export const UserAnalytics = model('analytic', userAnalyticsSchema);
