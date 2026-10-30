FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@12.4.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY src ./src
RUN mkdir -p /app/data && chown node:node /app/data
ENV HOST=0.0.0.0 PORT=4111 DATA_DIR=/app/data
USER node
EXPOSE 4111
CMD ["node", "src/main.ts"]
