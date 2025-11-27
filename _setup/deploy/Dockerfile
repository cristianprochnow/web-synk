# --- Estágio 1: Build (Usando Node) ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install --frozen-lockfile

# Copia o código fonte e o .env (importante para o Vite ler as variáveis no build)
COPY . .

# Realiza o build (gera a pasta /dist)
RUN yarn build

# --- Estágio 2: Servir (Usando Nginx) ---
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a nossa configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados no estágio anterior para a pasta do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 (interna do container)
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]