FROM nginx:1.20
RUN rm /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
