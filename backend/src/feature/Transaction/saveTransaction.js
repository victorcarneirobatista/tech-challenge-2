const DetailedAccountModel = require("../../models/DetailedAccount");

const saveTransaction = async ({ transaction, repository }) => {
  const shouldReverseValue =
    (transaction.type === "Debit" && transaction.value > 0) ||
    (transaction.type === "Credit" && transaction.value < 0);

  if (shouldReverseValue) {
    transaction.value *= -1;
  }

  // ✅ Força tipo com base no valor final
  transaction.type = transaction.value < 0 ? "Debit" : "Credit";

  console.log("🔍 Após correção:", transaction);

  const resultado = await repository.create(transaction);

  if (!resultado) {
    return {
      message: "❌ Erro ao salvar transação.",
      result: null,
    };
  }

  let transacaoConvertida = {};
  try {
    const plainObject = resultado.toObject ? resultado.toObject() : resultado;
    transacaoConvertida = new DetailedAccountModel(plainObject);
  } catch (error) {
    return {
      message: "❌ Transação criada, mas erro ao formatar dados",
      result: null,
    };
  }

  return {
    message: "✅ Transação criada com sucesso",
    result: transacaoConvertida,
  };
};

module.exports = saveTransaction;
