FROM node:lts-alpine AS build
WORKDIR /app

ENV PUBLIC_PAYLOAD_URL="/api"
ENV BRANDING_URL=""

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i
COPY . .

RUN \
  PUBLIC_PAYLOAD_URL=$PUBLIC_PAYLOAD_URL \
  BRANDING_URL=$BRANDING_URL \
  pnpm build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
