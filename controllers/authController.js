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

  res.json({ message: 'Email verify success' });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await authService.controlEmail(email);
  if (!user) throw HttpError(401, 'Email not  found');

  if (user.verify) throw HttpError(401, 'Email already  verify');

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

  const token = authService.generateToken(user);
  await authService.updateToken(user.id, token);

  res.status(200).json({ token, user: { email: user.email, name: user.name } });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await authService.updateToken(_id, '');
  res.status(200).json({ message: 'Logout success' });
};

export default {
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  verifyEmail: ctrlWrapper(verifyEmail),
  loginUser: ctrlWrapper(loginUser),
  registerUser: ctrlWrapper(registerUser),
};
