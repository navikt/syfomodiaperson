FROM node:22-alpine AS builder
WORKDIR /syfomodiaperson

COPY server.ts package.json tsconfig.json ./
COPY dist-server ./dist-server
COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /syfomodiaperson

COPY --from=builder /syfomodiaperson/package.json ./
COPY --from=builder /syfomodiaperson/dist-server/server.js ./
COPY --from=builder /syfomodiaperson/dist-server/server.js.map ./
COPY --from=builder /syfomodiaperson/dist-server/server ./server
COPY --from=builder /syfomodiaperson/dist/index.html ./dist/index.html
COPY --from=builder /syfomodiaperson/dist/main.bundle.js ./dist/main.bundle.js
COPY --from=builder /syfomodiaperson/node_modules ./node_modules
COPY --from=builder /syfomodiaperson/img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
