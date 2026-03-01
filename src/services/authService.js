const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/settings');

const TOKEN_EXPIRES = '7d';

/**
 * Создать JWT для пользователя
 */
function createToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: TOKEN_EXPIRES });
}

/**
 * Регистрация: создать пользователя и вернуть данные + токен
 * @throws при дубликате email или ошибке валидации
 */
async function registerUser(email, password) {
  const existing = await User.findOne({ email: email?.toLowerCase?.() || email });
  if (existing) {
    const err = new Error('Пользователь с таким email уже есть');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  const user = await User.create({ email, password });
  const token = createToken(user._id);
  return {
    user: { id: user._id, email: user.email },
    token,
  };
}

/**
 * Вход: проверить email/пароль и вернуть данные + токен
 * @throws при неверных данных
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email: email?.toLowerCase?.() || email });
  if (!user) {
    const err = new Error('Неверный email или пароль');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Неверный email или пароль');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = createToken(user._id);
  return {
    user: { id: user._id, email: user.email },
    token,
  };
}

module.exports = {
  createToken,
  registerUser,
  loginUser,
};
