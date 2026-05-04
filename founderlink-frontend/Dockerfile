# Build stage
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf