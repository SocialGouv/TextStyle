FROM node:14-alpine
WORKDIR /api
COPY package.json .
RUN npm install --only=production
COPY . .
EXPOSE 8080
CMD npm start