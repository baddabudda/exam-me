FROM node:latest

WORKDIR /usr/src/api

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . . 

CMD ["node","app.js"]

EXPOSE 3000