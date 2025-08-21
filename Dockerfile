FROM node:18-slim

# Install dependencies untuk puppeteer
RUN apt-get update && apt-get install -y \
  chromium \
  chromium-driver \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libdrm2 \
  libgbm1 \
  libxkbcommon0 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
