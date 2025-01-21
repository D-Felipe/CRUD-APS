#App build

FROM node:20 AS build

WORKDIR /app

COPY package.json /app/package.json

RUN npm install 

COPY . /app

#Express

FROM node:20

WORKDIR /app

COPY --from=build /app /app

RUN npm install -g nodemon

EXPOSE 5000

CMD ["npm", "run", "dev"]