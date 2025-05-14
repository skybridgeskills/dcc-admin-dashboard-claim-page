# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Set the port
ENV PORT=4009
ENV ORIGIN=http://localhost:4009

# Expose the port the app runs on
EXPOSE 4009

# Start the application
CMD ["node", "build"] 