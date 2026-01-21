FROM node:14

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Running as root by default (Security Risk)
EXPOSE 5002
CMD ["node", "index.js"]
