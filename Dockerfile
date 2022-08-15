FROM node:16-alpine As base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

FROM base As test
CMD ["npm", "run", "test:e2e"]


FROM base As build
RUN npm run build

FROM node:16-alpine As production

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]