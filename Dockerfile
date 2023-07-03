FROM node:16.17.0-alpine

RUN apk update
RUN apk add g++ make py3-pip git

WORKDIR /usr/src/app

COPY package*.json  ./

RUN npm i

COPY . .

RUN npm run build
CMD [ "node", "dist/src/server.js" ]

