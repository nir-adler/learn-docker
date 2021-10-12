FROM node:alpine

COPY package.json .

RUN npm install

COPY index.js .

CMD ["npm","run","start"]