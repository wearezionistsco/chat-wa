# Gunakan Node.js
FROM node:18-slim

# Install Chromium & dependencies
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

# Set env untuk puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Buat folder app
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install deps
RUN npm install

# Copy source code
COPY . .

# Expose port (tidak dipakai, tapi Railway butuh)
EXPOSE 3000

# Jalankan bot
CMD ["npm", "start"]
