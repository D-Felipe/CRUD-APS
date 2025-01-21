FROM node:20 AS build

WORKDIR /app

COPY package.json /app/package.json

RUN npm install --legacy-peer-deps

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]