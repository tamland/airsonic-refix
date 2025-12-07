# syntax=docker/dockerfile:1
FROM nginx:alpine

EXPOSE 8080

RUN apk --no-cache add gettext

# Setup an unprivileged user
RUN mkdir -p /app /resources/nginx

RUN addgroup -g 1000 appgroup && \
    adduser -D -u 1000 -G appgroup appuser
RUN chown -R appuser:appgroup /app

COPY docker/nginx.conf /resources/nginx.conf
COPY docker/nginx-app.conf /resources/nginx/app.conf

COPY docker/env.js.template /resources/env.js.template
COPY --chmod=755 docker/docker-entrypoint.sh /resources/docker-entrypoint.sh

USER appuser
COPY --chown=appuser:appgroup dist/ /app/

# Allows mounting a volume that retains the app (when read-only rootfs)
VOLUME /app

ENTRYPOINT ["/resources/docker-entrypoint.sh"]
CMD ["nginx", "-c", "/resources/nginx.conf", "-g", "daemon off;"]
