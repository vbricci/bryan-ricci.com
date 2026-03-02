FROM node:24-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm install

COPY . . 

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]  