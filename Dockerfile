FROM node:lts-alpine AS build
WORKDIR /app
# Read PUBLIC_PAYLOAD_URL from (build) arguments 
ARG PUBLIC_PAYLOAD_URL
ARG BASE_PATH
# Define env variable PUBLIC_PAYLOAD_URL with value from ARG
ENV PUBLIC_PAYLOAD_URL=$PUBLIC_PAYLOAD_URL
ENV BASE_PATH=$BASE_PATH
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i
COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
