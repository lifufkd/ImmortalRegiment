FROM nginx:alpine

RUN apk add --no-cache bash gettext

COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /entrypoint.sh
COPY . /usr/share/nginx/html/

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
