FROM node:14.17.3

WORKDIR /app

RUN npm init -y && npm install express \
    && git clone https://github.com/nir-adler/node-project-2.git \
    && cp node-project-2/* . && rm -r node-project-2

WORKDIR /app

VOLUME /app/www

EXPOSE 3000

CMD ["node","index.js"]