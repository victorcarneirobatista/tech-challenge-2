const userDTO = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tech-challenge';

class UserController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      getUser: require('../feature/User/getUser'),
    }, di);
  }

  async auth(req, res) {
    const { userRepository, getUser } = this.di;
    const { email, password } = req.body;

    try {
      const user = await getUser({
        repository: userRepository,
        userFilter: { email, password },
      });

      if (!user?.[0]) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const { _id, username, email: userEmail } = user[0];

      if (!_id || !username || !userEmail) {
        return res
          .status(500)
          .json({ message: 'Dados do usuário incompletos' });
      }

      const userToTokenize = {
        id: _id.toString(),
        username,
        email: userEmail,
      };

      const token = jwt.sign(userToTokenize, JWT_SECRET, {
        expiresIn: '12h',
      });

      res.status(200).json({
        message: 'Usuário autenticado com sucesso',
        result: {
          token,
          accountId: _id.toString(),
          username,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ message: 'Erro interno ao autenticar' });
    }
  }

  async create(req, res) {
    const { userRepository } = this.di;
    const { username, email, password } = req.body;

    try {
      const newUser = await userRepository.create({ username, email, password });

      const accountRepository = require('../infra/mongoose/repository/accountRepository');
      await accountRepository.create({
        type: 'Debit',
        userId: newUser._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });

      res.status(201).json({
        message: 'Usuário e conta criados com sucesso',
        user: newUser,
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(400).json({ message: 'Erro ao criar usuário' });
    }
  }

  async find(req, res) {
    const { userRepository } = this.di;

    try {
      const users = await userRepository.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado' });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro interno ao buscar usuários' });
    }
  }

  static getToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = UserController;
