# Stage 1: Build the React/Vite application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source and configuration files
COPY . .

# Embed a placeholder at build time so runtime container ENV can replace it on startup
ARG VITE_API_BASE_URL=__VITE_API_BASE_URL__
ARG VITE_API_URL=__VITE_API_BASE_URL__
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Default Nginx config for Single Page Application (SPA) routing
RUN printf '%s\n' \
    'server {' \
    '    listen 80;' \
    '    server_name _;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Inject runtime ENV (VITE_API_BASE_URL / VITE_API_URL) and optional Nginx proxy (API_UPSTREAM)
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '' \
    'if [ "${VITE_API_BASE_URL+x}" = "x" ]; then' \
    '  RAW_URL="$VITE_API_BASE_URL"' \
    'elif [ "${VITE_API_URL+x}" = "x" ]; then' \
    '  RAW_URL="$VITE_API_URL"' \
    'elif [ -n "${API_UPSTREAM:-}" ]; then' \
    '  RAW_URL=""' \
    'else' \
    '  RAW_URL="http://localhost:3000"' \
    'fi' \
    '' \
    'API_URL="${RAW_URL%/}"' \
    'ESCAPED_API_URL=$(printf "%s" "$API_URL" | sed "s/[&|\\]/\\\\&/g")' \
    '' \
    'find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|__VITE_API_BASE_URL__|${ESCAPED_API_URL}|g" {} +' \
    '' \
    'if [ -n "$API_URL" ]; then' \
    '  find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|http://localhost:3000|${ESCAPED_API_URL}|g" {} +' \
    'fi' \
    '' \
    'if [ -n "${API_UPSTREAM:-}" ]; then' \
    '  UPSTREAM="${API_UPSTREAM%/}"' \
    '  cat <<EOF > /etc/nginx/conf.d/default.conf' \
    'server {' \
    '    listen 80;' \
    '    server_name _;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '' \
    '    location /api/ {' \
    '        proxy_pass ${UPSTREAM}/api/;' \
    '        proxy_http_version 1.1;' \
    '        proxy_set_header Host \$proxy_host;' \
    '        proxy_set_header X-Real-IP \$remote_addr;' \
    '        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;' \
    '        proxy_set_header X-Forwarded-Proto \$scheme;' \
    '        proxy_ssl_server_name on;' \
    '    }' \
    '' \
    '    location /images/ {' \
    '        proxy_pass ${UPSTREAM}/images/;' \
    '        proxy_http_version 1.1;' \
    '        proxy_set_header Host \$proxy_host;' \
    '        proxy_set_header X-Real-IP \$remote_addr;' \
    '        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;' \
    '        proxy_set_header X-Forwarded-Proto \$scheme;' \
    '        proxy_ssl_server_name on;' \
    '    }' \
    '' \
    '    location / {' \
    '        try_files \$uri \$uri/ /index.html;' \
    '    }' \
    '}' \
    'EOF' \
    'fi' \
    > /docker-entrypoint.d/40-runtime-env.sh && \
    chmod +x /docker-entrypoint.d/40-runtime-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
