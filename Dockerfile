# Use uma imagem base oficial do Node.js. A versão Alpine é leve.
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de manifesto do pacote e instala as dependências
# Isso aproveita o cache do Docker, reinstalando dependências apenas se elas mudarem
COPY package*.json ./
RUN npm install

# Copia o resto dos arquivos da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que a aplicação Node.js roda
EXPOSE 3000

# Define o comando para iniciar a aplicação quando o container for executado
CMD [ "npm", "start" ]
