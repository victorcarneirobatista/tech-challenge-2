const express = require('express') // ⬅️ corrigido
const publicRoutes = require('./publicRoutes')
const routes = require('./routes')
const connectDB = require('./infra/mongoose/mongooseConect')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger')
const UserController = require('./controller/User')
const cors = require('cors')

const app = express() // ⬅️ corrigido

// Middleware para aceitar JSON
app.use(express.json()) // ⬅️ corrigido

// Middleware CORS
app.use(cors({
    origin: '*'
}))

// Rotas públicas (ex: /auth/login)
app.use(publicRoutes)

// Documentação Swagger (deve ser sempre acessível)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// ✅ Middleware de autenticação (aplicado somente após rotas públicas)
app.use((req, res, next) => {
    if (req.url.includes('/docs')) return next()

    const authHeader = req.headers['authorization']
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

    if (!token) {
        return res.status(401).json({ message: 'Token ausente ou inválido' })
    }

    const user = UserController.getToken(token)

    if (!user) {
        return res.status(401).json({ message: 'Token inválido' })
    }

    req.user = user
    next()
})

// Rotas protegidas (apenas após autenticação)
app.use(routes)

// Conexão com MongoDB e start do servidor
connectDB().then(() => {
    app.listen(3001, '0.0.0.0', () => {
        console.log('Servidor rodando na porta 3001')
    })
})

module.exports = app
