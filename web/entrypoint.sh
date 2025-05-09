#!/bin/sh

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:8000}"
LONG_POLLING_DELAY="${LONG_POLLING_DELAY:-1}"

cat <<EOF > /usr/share/nginx/html/js/config.js
export const API_BASE_URL = "${API_BASE_URL}";
export const LONG_POLLING_DELAY = ${LONG_POLLING_DELAY};
EOF

# Run nginx
exec nginx -g 'daemon off;'