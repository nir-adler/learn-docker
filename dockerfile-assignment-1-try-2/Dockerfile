FROM node:latest

WORKDIR /app

RUN npm install express 2>/dev/null

COPY index.js index.js

VOLUME /index

EXPOSE 3000

CMD [ "node","index.js" ]