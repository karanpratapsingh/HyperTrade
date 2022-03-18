FROM node:16.14-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 8080
CMD npm run dev

FROM node:16.14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.20-alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
