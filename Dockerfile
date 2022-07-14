FROM node:16.15.1

COPY . /app
WORKDIR /app/frontend
RUN yarn install
CMD yarn run dev