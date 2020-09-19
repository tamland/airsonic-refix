#!/bin/sh
set -e
envsubst < env.js.template > /var/www/html/env.js
exec "$@"
