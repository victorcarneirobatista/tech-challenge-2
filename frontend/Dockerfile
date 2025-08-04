# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos e instala dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Build de produção
RUN npm run build

# Etapa 2: imagem final apenas com app pronto
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Expõe a porta usada pelo Next
EXPOSE 3000

# Inicia o servidor
CMD ["npm", "start"]
