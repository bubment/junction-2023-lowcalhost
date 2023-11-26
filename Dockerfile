FROM node:18

WORKDIR /app

COPY package.json package-lock.json index.js services.js /app/
COPY public /app/public

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start:prod"]