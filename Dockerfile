# -----------------------
# 1) BUILD STAGE
# -----------------------
FROM node:18 AS builder

# Create and use /app directory for building
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your source files
COPY . .

# Build the NextJS application
RUN npm run build


# -----------------------
# 2) RUN STAGE
# -----------------------
FROM node:18-alpine

# Create directories for Hermes configs, data and logs
RUN mkdir -p /opt/hermes/config \
    && mkdir -p /opt/hermes/data \
    && mkdir -p /opt/hermes/logs

# (Optional) Set environment variables if your NextJS app reads them
#   from process.env (for example, config location or logging).
# ENV HERMES_CONFIG_DIR="/opt/hermes/config"
# ENV HERMES_LOG_DIR="/opt/hermes/logs"
# ENV HERMES_DATA_DIR="/opt/hermes/data"

# Switch to /app as the working directory
WORKDIR /app

# Copy NextJS build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the NextJS port
EXPOSE 3000

# Start the NextJS application
CMD ["npm", "run", "start"]
