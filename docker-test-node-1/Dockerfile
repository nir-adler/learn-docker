FROM node

WORKDIR /app

RUN npm init -y && npm install express

COPY index.js index.js

VOLUME /app/files

EXPOSE 3000

WORKDIR /app


CMD ["node","index.js"]