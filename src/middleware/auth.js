const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/settings');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Нет токена доступа' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Неверный токен' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истёк' });
    }
    res.status(500).json({ message: 'Ошибка сервера', details: err.message });
  }
};

module.exports = auth;
