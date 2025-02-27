export const checkRole = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. You do not have the required permissions.',
    });
  }

  next();
};
