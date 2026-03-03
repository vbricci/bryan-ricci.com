FROM node:24-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY DockerEnv ./.env
RUN npm install

COPY . . 

RUN npm run build

RUN rm .env

EXPOSE 3000
CMD ["npm", "start"]  