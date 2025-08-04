const { Account, DetailedAccount } = require('../modelos'); // ⬅️ Corrigido aqui

// Criação de conta
const create = async (userData) => {
  const user = new Account(userData);
  return user.save();
};

// Buscar conta por ID
const getById = async (id) => {
  return Account.findById(id);
};

// Buscar lista de contas com filtro
const get = async (account = {}) => {
  return Account.find(account);
};

// ✅ Atualizar transação existente
const updateTransaction = async (id, updatedData) => {
  return DetailedAccount.findByIdAndUpdate(id, updatedData, { new: true });
};

// Exportando todas as funções
module.exports = {
  create,
  getById,
  get,
  updateTransaction
};
