FROM node:16-alpine AS builder
WORKDIR /src
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine
RUN apk add gettext
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/env.js.template /env.js.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY --from=builder /src/dist/ /var/www/html/

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
