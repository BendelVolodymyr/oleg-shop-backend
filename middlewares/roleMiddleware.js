export const checkRole = roles => {
  return (req, res, next) => {
    const userRole = req.user.role; // отримаємо роль користувача з токену

    // Перевірка, чи має користувач відповідну роль
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access denied. You do not have the required permissions.',
      });
    }

    next(); // Якщо роль підходить, переходимо до наступного middleware або контролера
  };
};

/// need testing
