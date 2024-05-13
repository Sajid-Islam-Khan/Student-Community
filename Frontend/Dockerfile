FROM node:18.19.0-bookworm-slim

WORKDIR /app

COPY . .

RUN bash -c "npm install"

EXPOSE 4000

CMD ["npm", "run", "dev"]
