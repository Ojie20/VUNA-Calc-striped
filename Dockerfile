# Stage 1: builder — install deps and run tests
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run lint
RUN npm run test:ci

# Stage 2: production — just Nginx serving your static files
FROM nginx:alpine AS production

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy only your static files from the builder stage
COPY --from=builder /app/src/index.html   /usr/share/nginx/html/
COPY --from=builder /app/src/assets/css/styles.css    /usr/share/nginx/html/
COPY --from=builder /app/src/assets/js/script.js    /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1