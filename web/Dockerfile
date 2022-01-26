FROM node:16.13.2 AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD npm run dev
