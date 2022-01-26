FROM node:16.13.2 AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 80
CMD npm run dev
