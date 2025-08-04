const TransactionDTO = require('../models/DetailedAccount');

class AccountController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),
      transactionRepository: require('../infra/mongoose/repository/detailedAccountRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
      getAccount: require('../feature/Account/getAccount'),
      saveTransaction: require('../feature/Transaction/saveTransaction'),
      getTransaction: require('../feature/Transaction/getTransaction'),
      getCard: require('../feature/Card/getCard'),

      updateTransaction: require('../infra/mongoose/repository/accountRepository').updateTransaction,
    }, di);
  }

  async find(req, res) {
    const {
      accountRepository,
      getAccount,
      getCard,
      getTransaction,
      transactionRepository,
      cardRepository
    } = this.di;

    try {
      const userId = req.user.id;
      const account = await getAccount({
        repository: accountRepository,
        filter: { userId }
      });

      const transactions = await getTransaction({
        filter: { accountId: account[0].id },
        repository: transactionRepository
      });

      const cards = await getCard({
        filter: { accountId: account[0].id },
        repository: cardRepository
      });

      res.status(200).json({
        message: 'Conta encontrada carregado com sucesso',
        result: {
          account,
          transactions,
          cards
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro no servidor'
      });
    }
  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di;

    try {
      const { accountId, value, type, from, to, date } = req.body;

      if (!accountId) {
        return res.status(400).json({ message: "accountId é obrigatório" });
      }

      const transactionDTO = new TransactionDTO({
        accountId,
        value,
        from,
        to,
        anexo: null,
        type,
        date: new Date(`${date}T12:00:00`)
      });

      const transaction = await saveTransaction({
        transaction: transactionDTO,
        repository: transactionRepository
      });

      res.status(201).json({
        message: '✅ Transação criada com sucesso',
        result: transaction
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno ao criar transação" });
    }
  }

  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di;
    const { accountId } = req.params;

    const transactions = await getTransaction({
      filter: { accountId },
      repository: transactionRepository
    });

    res.status(201).json({
      message: 'Transação criada com sucesso',
      result: {
        transactions
      }
    });
  }

  async updateTransaction(req, res) {
    const { updateTransaction } = this.di;
    const { id } = req.params;
    const { type, value, date } = req.body;

    try {
      const updated = await updateTransaction(id, {
        type,
        value,
        date
      });

      if (!updated) {
        return res.status(404).json({ message: "Transação não encontrada" });
      }

      res.status(200).json({
        message: "Transação atualizada com sucesso",
        result: updated
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar transação" });
    }
  }
}

module.exports = AccountController;
