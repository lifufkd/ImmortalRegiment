FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY nginx.conf ./
COPY src ./src

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
