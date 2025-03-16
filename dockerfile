FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000

ENV DB_PATH=/data/notes.db

RUN mkdir -p /data

CMD ["bun", "start"]