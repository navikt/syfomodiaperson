FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim
WORKDIR /syfomodiaperson

COPY package.json ./
COPY dist-server/server.js ./
COPY dist-server/server.js.map ./
COPY dist-server/server ./server
COPY dist/index.html ./dist/index.html
COPY dist/main.bundle.js ./dist/main.bundle.js
COPY node_modules ./node_modules
COPY img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
