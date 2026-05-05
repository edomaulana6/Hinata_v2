FROM node:20-bullseye

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .

CMD ["node", "index.js"]
