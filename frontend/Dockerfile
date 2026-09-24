# Frontend React (Node 20 + Vite)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (cache de camadas)
COPY package*.json ./

# Instala as dependências do Node
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Expõe a porta padrão do servidor de desenvolvimento do Vite
EXPOSE 5173

# Comando padrão de inicialização do servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
