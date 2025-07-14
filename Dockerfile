# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Force no cache by adding build timestamp
RUN echo "// Build time: $(date)" >> src/configs/api.ts
# Set environment variable for build
ENV VITE_API_BASE_URL=http://34.207.66.178:5000/
# Clear any cached files
RUN rm -rf node_modules/.vite || true
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx for HTTP on port 3000
RUN echo 'server { \
  listen 3000; \
  server_name _; \
  \
  root /usr/share/nginx/html; \
  index index.html; \
  \
  location / { \
    try_files $uri /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
