FROM nginx:alpine

EXPOSE 80

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /var/www/html/
