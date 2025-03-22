import { setUserPreferencesCookie } from '../helpers/cookie.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import adminService from '../services/adminService.js';

const registerAdmin = async (req, res) => {
  const newAdmin = await adminService.registerAdmin(req.body);
  res.status(201).json(newAdmin);
};

const loginAdmin = async (req, res) => {
  const { email, password, role } = req.body;

  const admin = await adminService.controlEmail(email);
  if (!admin) throw HttpError(401, 'Email is invalid');

  if (admin.role != role) throw HttpError(401, 'Role is invalid');

  const resultPasswordCompare = await adminService.passwordCompare(
    password,
    admin.password
  );

  if (!resultPasswordCompare) throw HttpError(401, 'Password is invalid');

  admin.password = undefined;
  const accessToken = adminService.createAccessToken(admin);
  const refreshToken = adminService.createRefreshToken(admin);
  await adminService.updateTokens(admin.id, accessToken, refreshToken);

  setUserPreferencesCookie(res, refreshToken, 'adminRefreshToken');

  admin.accessToken = undefined;
  admin.refreshToken = undefined;

  res.status(200).json({ accessToken, admin });
};

const getRefresh = async (req, res) => {
  const { adminRefreshToken } = req.cookies;

  if (!adminRefreshToken) throw HttpError(401, 'Refresh token is missing');

  const admin = await adminService.verifyRefreshToken(adminRefreshToken);
  if (!admin) throw HttpError(401, 'Not authorized');

  const newAccessToken = adminService.createAccessToken(admin);
  await adminService.updateTokens(admin.id, newAccessToken, adminRefreshToken);

  setUserPreferencesCookie(res, adminRefreshToken, 'adminRefreshToken');

  admin.password = undefined;
  admin.accessToken = undefined;
  admin.refreshToken = undefined;

  res.status(200).json({
    accessToken: newAccessToken,
    admin,
  });
};

const logoutAdmin = async (req, res, next) => {
  const { id } = req.user;

  await adminService.updateTokens(id, '', '');

  res.clearCookie('adminRefreshToken');
  res.status(200).json({ message: 'Logout success' });
};

export default {
  registerAdmin: ctrlWrapper(registerAdmin),
  loginAdmin: ctrlWrapper(loginAdmin),
  logoutAdmin: ctrlWrapper(logoutAdmin),
  getRefresh: ctrlWrapper(getRefresh),
};
