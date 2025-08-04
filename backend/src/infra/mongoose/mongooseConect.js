const mongoose = require('mongoose');
require('dotenv').config(); // Garante que funcione localmente também

async function connectDB() {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    console.error("❌ Erro: MONGO_URL não definida no .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri); // Sem os options obsoletos
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
