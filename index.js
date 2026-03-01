const mongoose = require('mongoose');
const app = require('./src/app');
const { port, mongoUri, validateEnv } = require('./src/config/settings');

validateEnv();

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Успешное подключение к MongoDB');
    app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к базе:', err.message);
    process.exit(1);
  });
