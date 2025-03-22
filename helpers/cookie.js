import dotenv from 'dotenv';
dotenv.config();

const { NODE_ENV } = process.env;

export const setUserPreferencesCookie = (
  res,
  refreshToken,
  key = 'refreshToken'
) => {
  res.cookie(key, refreshToken, {
    httpOnly: true, // Забороняє доступ до кукі через JavaScript
    secure: NODE_ENV === 'production', // Встановлює secure у продакшні
    sameSite: 'Strict', // Обмежує доступ до кукі тільки з того ж домену
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
  });
};
