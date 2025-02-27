import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import adminService from '../services/adminService.js';

const registerAdmin = async (req, res, next) => {
  const newUser = await adminService.registerAdmin(req.body);
  res.status(201).json(newUser);
};

const loginAdmin = async (req, res, next) => {
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
  const token = adminService.generateToken(admin);
  await adminService.updateToken(admin.id, token);
  admin.token = undefined;

  res.status(200).json({ token, admin });
};

const logout = async (req, res, next) => {
  const { id } = req.user;
  console.log(req.user);

  await adminService.updateToken(id, '');
  res.status(200).json({ message: 'Logout success' });
};

export default {
  registerAdmin: ctrlWrapper(registerAdmin),
  loginAdmin: ctrlWrapper(loginAdmin),
  logout: ctrlWrapper(logout),
};
