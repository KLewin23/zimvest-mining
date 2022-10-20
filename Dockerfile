FROM node:18-alpine AS node

FROM node AS builder
RUN apk update && \
    apk add --no-cache libc6-compat autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node AS final
ENV NODE_ENV production
RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN yarn global add pm2
COPY --chown=node:node --from=builder /app ./
RUN yarn install --production
RUN yarn global add pm2
USER node
EXPOSE 3000
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]
