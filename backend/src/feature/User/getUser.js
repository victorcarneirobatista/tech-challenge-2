// src/feature/User/getUser.js

const User = require("../../models/User");

const getUser = async ({ userFilter, repository }) => {
  try {
    const result = await repository.get(userFilter);
    
    console.log("✅ Usuário encontrado:", result);

    return result?.map(user => new User(user));
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error);
    return null;
  }
};

module.exports = getUser;
