import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendEmail.js';
import authService from '../services/authService.js';
import analyticsService from '../services/analyticsService.js';

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

  const accessToken = authService.accessToken(user);
  const refreshToken = authService.refreshToken(user);
  await authService.updateToken(user._id, accessToken, refreshToken);

  res.status(200).json({
    accessToken,
    refreshToken,
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

  const accessToken = authService.accessToken(user);
  const refreshToken = authService.refreshToken(user);
  await authService.updateToken(user.id, accessToken, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    httpOnly: true, // Забороняє доступ до cookie через JavaScript
    secure: process.env.NODE_ENV === 'production', // Якщо в продакшн середовищі, використовувати secure cookies
    sameSite: 'Strict', // Забороняє доступ з іншого домену (додатковий рівень захисту)
  });

  res.status(200).json({
    accessToken,
    user: { email: user.email, name: user.name },
  });
};

const logoutUser = async (req, res) => {
  const { id } = req.user;

  await authService.updateToken(id, '', '');

  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout success' });
};

export default {
  logoutUser: ctrlWrapper(logoutUser),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  verifyEmail: ctrlWrapper(verifyEmail),
  loginUser: ctrlWrapper(loginUser),
  registerUser: ctrlWrapper(registerUser),
};
