# 🔴 INTENTIONAL: Using older Node version
FROM node:14-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# 🔴 INTENTIONAL: npm install instead of npm ci (less secure)
RUN npm install

# Copy application code
COPY app.js .

# Expose port
EXPOSE 3000

# 🔴 INTENTIONAL: Running as root user
CMD ["node", "app.js"]
