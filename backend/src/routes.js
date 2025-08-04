const { Router } = require('express');
const AccountController = require('./controller/Account');

const accountController = new AccountController({});
const router = Router();

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Busca contas
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contas encontradas
 */
router.get('/account', accountController.find.bind(accountController));

/**
 * @swagger
 * /account/transaction:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               value:
 *                 type: number
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post(
  '/account/transaction',
  accountController.createTransaction.bind(accountController)
);

/**
 * @swagger
 * /account/transaction/{id}:
 *   put:
 *     summary: Atualiza uma transação existente
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: Credit
 *               value:
 *                 type: number
 *                 example: 100
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.put('/account/transaction/:id', accountController.updateTransaction.bind(accountController));

/**
 * @swagger
 * /account/{accountId}/statement:
 *   get:
 *     summary: Obtém extrato da conta
 *     tags: [Extratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         description: ID da conta
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Extrato encontrado
 *       401:
 *         description: Token invalido
 */
router.get('/account/:accountId/statement', accountController.getStatment.bind(accountController));

module.exports = router;
