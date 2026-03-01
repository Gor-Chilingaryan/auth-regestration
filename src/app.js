const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

module.exports = app;
