import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

import authService from '../services/authService.js';
import analyticsService from '../services/analyticsService.js';

const registerUser = async (req, res, next) => {
  const { name, email, password, registrationMethod } = req.body;

  const newUser = await authService.registerAuth({ name, email, password });

  const analyticsData = analyticsService.getAnalyticsData(
    req,
    newUser._id,
    registrationMethod
  );

  await analyticsService.SaveUserAnalytics(analyticsData);

  res.status(201).json({ name: newUser.name, email: newUser.email });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.controlEmail(email);
  if (!user) throw HttpError(401, 'Email is invalid');

  // if (!user.verify) throw HttpError(401, 'Email not verify');

  const resultPasswordCompare = await authService.passwordCompare(
    password,
    user.password
  );
  if (!resultPasswordCompare) throw HttpError(401, 'Password is invalid');

  const token = authService.generateToken(user);

  res.status(200).json({ token, user: { email: user.email, name: user.name } });
};

const logoutUser = async (req, res, next) => {
  const { _id } = req.user;
  await logoutUser(_id);
  res.status(204).end();
};

export default {
  loginUser: ctrlWrapper(loginUser),
  registerUser: ctrlWrapper(registerUser),
};
