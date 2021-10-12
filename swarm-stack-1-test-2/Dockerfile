FROM node:latest

WORKDIR /app

RUN npm init -y && npm install express \
    && apt update && apt install git-all -y
WORKDIR /app

RUN git clone https://github.com/nir-adler/node-project.git \
    && cd /app/node-project && mv index.js ../ && cd .. && rm -r node-project/

EXPOSE 3000

CMD [ "node", "index.js"]


