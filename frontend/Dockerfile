# Usa o Node.js para rodar o React
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package*.json ./
RUN npm install

# Copia todo o resto do código do frontend
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Inicia o servidor de desenvolvimento liberando acesso externo (--host)
CMD ["npm", "run", "dev", "--", "--host"]       