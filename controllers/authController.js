import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import authService from '../services/authService.js';
import analyticsService from '../services/analyticsService.js';
import { setUserPreferencesCookie } from '../helpers/cookie.js';

const registerUser = async (req, res) => {
  const { email, password, registrationMethod } = req.body;

  const verificationCode = authService.generateCode();

  const newUser = await authService.registerAuth({
    email,
    password,
    verificationCode,
  });

  await sendEmail.sendEmail(email, verificationCode);

  const analyticsData = analyticsService.getAnalyticsData(
    req,
    newUser._id,
    registrationMethod
  );

  await analyticsService.SaveUserAnalytics(analyticsData);

  res.status(201).json({ email: newUser.email });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await authService.controlVerifyCode(verificationCode);

  if (!user) throw HttpError(401, 'Verification code is not valid');
  await authService.updateUseVerify(user._id);

  const tokenAcs = authService.createAccessToken(user);
  const tokenRef = authService.createRefreshToken(user);
  await authService.updateTokens(user._id, tokenAcs, tokenRef);

  setUserPreferencesCookie(res, tokenRef);

  res.status(200).json({
    accessToken: tokenAcs,
    message: 'Email verification success',
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await authService.controlEmail(email);
  if (!user) throw HttpError(401, 'Invalid credentials');

  if (user.verify) throw HttpError(401, 'Email already verified');

  await sendEmail.sendEmail(email, user.verificationCode);

  res.json({ message: 'Verify email send success' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.controlEmail(email);
  if (!user) throw HttpError(401, 'Email not  found');

  if (!user.verify) throw HttpError(401, 'Email not verify');

  const resultPasswordCompare = await authService.passwordCompare(
    password,
    user.password
  );
  if (!resultPasswordCompare) throw HttpError(401, 'Password is invalid');

  const tokenAcs = authService.createAccessToken(user);
  const tokenRef = authService.createRefreshToken(user);
  await authService.updateTokens(user._id, tokenAcs, tokenRef);

  setUserPreferencesCookie(res, tokenRef);

  res.status(200).json({
    accessToken: tokenAcs,
    user: { email: user.email, name: user.name },
  });
};

const getRefresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw HttpError(401, 'Refresh token is missing');

  const user = await authService.verifyRefreshToken(refreshToken);
  if (!user) throw HttpError(401, 'Not authorized');

  const newAccessToken = authService.createAccessToken(user);
  await authService.updateTokens(user.id, newAccessToken, refreshToken);

  setUserPreferencesCookie(res, refreshToken);

  res.status(200).json({
    accessToken: newAccessToken,
    user: { email: user.email, name: user.name }, // в майбутньому імя
  });
};

const logoutUser = async (req, res) => {
  const { id } = req.user;

  await authService.updateTokens(id, '', '');

  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout success' });
};

export default {
  getRefresh: ctrlWrapper(getRefresh),
  logoutUser: ctrlWrapper(logoutUser),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  verifyEmail: ctrlWrapper(verifyEmail),
  loginUser: ctrlWrapper(loginUser),
  registerUser: ctrlWrapper(registerUser),
};
