FROM node:12-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder app/dist /app/dist
COPY --from=builder app/package*.json /app/
RUN npm ci
EXPOSE 3000
