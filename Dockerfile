# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies (including dev dependencies for build)
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Verify build output exists
RUN ls -la dist/

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install git and backend dependencies
RUN apk add --no-cache git && \
    npm install --only=production

# Copy backend source
COPY backend/ ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S gestdown -u 1001

# Change ownership of the app directory
RUN chown -R gestdown:nodejs /app

# Switch to non-root user
USER gestdown

# Expose port
EXPOSE 64395

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:64395/manifest.json', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server.js"]
