FROM node:14.17.1

WORKDIR app/

COPY index.js package.json ./

RUN npm install -y

EXPOSE 3000

CMD ["npm","start"]

