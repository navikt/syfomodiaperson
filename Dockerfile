FROM node:14-alpine
WORKDIR /syfomodiaperson

COPY server.ts package.json ./

COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist
COPY server ./server

RUN npm install -g ts-node typescript @types/node

EXPOSE 8080
CMD ["ts-node", "server.ts"]
