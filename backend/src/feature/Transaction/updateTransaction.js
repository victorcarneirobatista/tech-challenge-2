const jwt = require('jsonwebtoken')
const {
  encontrarTransacaoPorId,
  atualizarTransacao,
} = require('../../infra/mongoose/repository/transactionRepository')

module.exports = async function updateTransaction(req, res) {
  try {
    const { id } = req.params
    const { type, value, date } = req.body
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não enviado' })
    }

    const token = authHeader.split(' ')[1]

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'chavesecreta')
    } catch (error) {
      return res.status(403).json({ message: 'Token inválido' })
    }

    const transacaoExistente = await encontrarTransacaoPorId(id)

    if (!transacaoExistente) {
      return res.status(404).json({ message: 'Transação não encontrada' })
    }

    const atualizada = await atualizarTransacao(id, {
      type: type ?? transacaoExistente.type,
      value: value ?? transacaoExistente.value,
      date: date ?? transacaoExistente.date,
    })

    return res.status(200).json({
      message: 'Transação atualizada com sucesso',
      result: atualizada,
    })
  } catch (error) {
    console.error('Erro ao atualizar transação:', error)
    return res
      .status(500)
      .json({ message: 'Erro interno ao atualizar transação' })
  }
}
