const mongoose = require('mongoose');
require('dotenv').config(); // ← garante que o .env funcione localmente também

async function connectDB() {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    console.error("❌ Erro: MONGO_URL não definida no .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    + await mongoose.connect(mongoUri);
    console.log(`✅ Conectado ao MongoDB: ${mongoUri}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
