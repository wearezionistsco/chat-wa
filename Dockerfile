FROM node:18-slim

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-adaptor \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxtst6 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxi6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
