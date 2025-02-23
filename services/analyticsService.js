import { UserAnalytics } from '../models/userAnalyticsModel.js';
import geoip from 'geoip-lite';
import useragent from 'useragent';

const getAnalyticsData = (req, userId, registrationMethod) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const geo = geoip.lookup(ipAddress);
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceType = agent.device.toString() === 'Other' ? 'desktop' : 'mobile';

  return {
    userId,
    deviceType,
    os: agent.os.toString(),
    browser: agent.toAgent(),
    language: req.headers['accept-language']?.split(',')[0] || 'unknown',
    ipAddress,
    location: geo ? { country: geo.country, city: geo.city } : {},
    referralSource: req.headers['referer'] || 'direct',
    registrationMethod,
  };
};

const SaveUserAnalytics = async analyticsData => {
  return await UserAnalytics.create(analyticsData);
};

export default { getAnalyticsData, SaveUserAnalytics };
