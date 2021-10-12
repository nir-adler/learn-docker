FROM node:latest

WORKDIR /app

RUN  npm init -y && npm install express

WORKDIR /app

COPY index.js index.js

VOLUME /web

EXPOSE 3000

CMD ["node","index.js"]