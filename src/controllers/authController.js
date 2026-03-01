const authService = require('../services/authService');

/**
 * Регистрация пользователя
 */
async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Нужны email и пароль' });
    }
    const { user, token } = await authService.registerUser(email, password);
    res.status(201).json({
      message: 'Пользователь создан',
      token,
      user,
    });
  } catch (err) {
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Ошибка сервера', details: err.message });
  }
}

/**
 * Вход (логин)
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Нужны email и пароль' });
    }
    const { user, token } = await authService.loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: 'Ошибка сервера', details: err.message });
  }
}

/**
 * Текущий пользователь (требует авторизации)
 */
function getMe(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  getMe,
};
