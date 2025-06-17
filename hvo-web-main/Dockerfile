# Stage 1: Dependencies
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Stage 2: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG APP_TYPE=main
ENV NEXT_PUBLIC_APP_TYPE=${APP_TYPE}

RUN yarn build

# Stage 3: Runner
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S mvpmasters -u 1001

COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown mvpmasters:nodejs .next

COPY --from=builder --chown=mvpmasters:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER mvpmasters

EXPOSE 3000

ARG APP_TYPE=main
ENV NEXT_PUBLIC_APP_TYPE=${APP_TYPE}

CMD yarn start
