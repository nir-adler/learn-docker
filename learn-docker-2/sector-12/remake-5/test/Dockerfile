FROM nginx:latest 
WORKDIR /public
RUN mkdir /public/www
RUN mkdir /public/images
COPY ./index.html /public/www
COPY ./conf/default.conf /etc/nginx/conf.d
COPY ./images/car.jpg /public/images
