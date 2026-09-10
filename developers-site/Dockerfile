# developers.mmvietnam.com - Node.js + Express (CommonJS) backend serving a
# React (CommonJS build via Webpack/Babel) frontend. Single process, single
# port - no Python/cron components.

# ---- Build stage: install deps + compile public/bundle.js -----------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage: production deps + built assets only -------------------
FROM node:20-alpine AS runtime

LABEL maintainer="MMVN Dev Team"
LABEL description="developers.mmvietnam.com - internal dev portal + API Standard reference"

ENV NODE_ENV=production \
    PORT=4000

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=builder /app/public ./public

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000

# STD-API-SD-001 muc 2: health check endpoint de Service Discovery/K8s loai
# bo instance loi. App expose tai /api/v1/health (xem server/app.js).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/v1/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server/index.js"]
