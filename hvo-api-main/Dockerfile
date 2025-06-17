FROM node:lts AS base
WORKDIR /app
COPY package.json yarn.* ./
RUN yarn install
COPY . .
RUN npm run prisma:generate
RUN npm run build

# COPY src/mailer/templates dist/mailer/templates

FROM node:lts AS production
ARG user=mvp-masters
ARG group=${user}
ARG uid=1001
ARG gid=$uid

WORKDIR /app
RUN groupadd --gid ${gid} ${user}
RUN useradd --uid ${uid} --gid ${gid} -m ${user}

COPY --from=base /app/node_modules/ ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/dist ./dist
COPY --from=base /app/src ./src
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/tsconfig* ./

RUN chown -R ${uid}:${gid} /app/
RUN yarn install --production
USER ${user}
EXPOSE 8080
CMD ["npm", "start"]