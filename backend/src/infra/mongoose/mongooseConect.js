const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URL; // <- agora pega do docker

    if (process.env.NODE_ENV === 'development' || !mongoUri) {
      // Iniciar MongoDB em memória para desenvolvimento local sem Docker
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Conectado ao MongoDB em memória');
    } else {
      // Conectar ao Mongo real via Docker Compose
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`✅ Conectado ao MongoDB: ${mongoUri}`);
    }
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
