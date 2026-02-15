#!/bin/sh
set -e
envsubst < /resources/env.js.template > /app/env.js
exec "$@"
