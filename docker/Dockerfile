FROM nginx:alpine
LABEL org.opencontainers.image.source https://github.com/aleksclark/airsonic-refix
EXPOSE 80

RUN apk add gettext
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/env.js.template /env.js.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY dist/ /var/www/html/

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
