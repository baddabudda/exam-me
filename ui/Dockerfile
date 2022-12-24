FROM node:latest

WORKDIR /usr/src/client

COPY package.json .
COPY package-lock.json .

RUN npm install -g @angular/cli

COPY . . 

CMD ["node","app.js"]

EXPOSE 4200