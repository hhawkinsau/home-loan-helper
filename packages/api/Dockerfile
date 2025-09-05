# Development Dockerfile
FROM node:22-alpine

# Create app user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Change ownership to app user
RUN chown -R app:app /app

# Switch to app user
USER app

# Generate Prisma client
RUN pnpm db:generate

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]
