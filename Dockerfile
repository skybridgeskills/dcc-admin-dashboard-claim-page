FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i
COPY . ./
RUN pnpm build

FROM nginx:alpine AS runtime
RUN apk add --no-cache aws-cli
ENV S3_BUCKET=""
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/brand /usr/share/nginx/brand
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/bin/ash", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
