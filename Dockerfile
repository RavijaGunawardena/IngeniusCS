FROM node:22.9.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p dist/data && cp src/data/*.json dist/data/

EXPOSE 3000

CMD ["node", "dist/server.js"]
