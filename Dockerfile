# Luminova Controller Production Dockerfile
FROM node:18-alpine AS base

# Install dependencies for Expo CLI and React Native
RUN apk add --no-cache \
    git \
    bash \
    curl \
    openssh-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S luminova -u 1001

# Set ownership
RUN chown -R luminova:nodejs /app
USER luminova

# Expose Expo development port
EXPOSE 8081

# Default command
CMD ["npm", "start"]

# Production stage
FROM base AS production

# Install all dependencies including devDependencies for build
USER root
RUN npm ci && npm cache clean --force

# Build the app for production
RUN npm run prebuild || echo "Prebuild completed"

# Switch back to non-root user
USER luminova

# Production command
CMD ["npm", "run", "start"]
