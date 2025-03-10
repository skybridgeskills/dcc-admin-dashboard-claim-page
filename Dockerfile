FROM node:lts-alpine AS build
WORKDIR /app

ENV PUBLIC_PAYLOAD_URL="https://dashboard.prettygoodskills.com/api"
ENV BRANDING_URL="https://branding-dcc-claim.s3-us-west-2.amazonaws.com/"
ENV S3_BUCKET=""
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm i
COPY . .

RUN pnpm build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/brand /usr/share/nginx/brand
EXPOSE 8080
ENTRYPOINT ["entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
