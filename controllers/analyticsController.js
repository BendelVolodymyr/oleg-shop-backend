import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import userAnalyticsServices from '../services/analyticsService.js';

const getAnalytics = async (req, res, next) => {
  const analytics = await userAnalyticsServices.getUserAnalytics();
  res.json(analytics);
};

export default { getAnalytics: ctrlWrapper(getAnalytics) };
