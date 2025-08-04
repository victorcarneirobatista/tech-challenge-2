const { Transaction } = require('../modelos')

async function encontrarTransacaoPorId(id) {
  return Transaction.findById(id)
}

async function atualizarTransacao(id, novosDados) {
  return Transaction.findByIdAndUpdate(id, novosDados, { new: true })
}

module.exports = {
  encontrarTransacaoPorId,
  atualizarTransacao,
}
