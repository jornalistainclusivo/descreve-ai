FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package.json package-lock.json ./

# Instalação limpa das dependências
RUN npm ci

# Copiar o restante do código-fonte
COPY . .

# Gerar o client do Prisma (necessário pois há dependência/schema do prisma)
RUN npx prisma generate

# Expor a porta configurada
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
