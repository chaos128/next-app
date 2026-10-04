# syntax=docker/dockerfile:1
# 공식 예제(vercel/next.js examples/with-docker)와 같은 multi-stage 구조
#   deps → builder → (static-assets: CI 전용) → runner(최종 이미지)

# Node.js 24 = 2026-09 기준 Active LTS. slim = glibc 기반(공식 예제 권장)
ARG NODE_VERSION=24-slim

# ───────── 1단계: 의존성 설치 ─────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
# package*.json 만 먼저 복사 → 소스만 바뀐 빌드에서는 이 단계를 캐시로 건너뜀
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ───────── 2단계: 빌드 ─────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# CI 가 --build-arg APP_VERSION=<git 커밋 SHA> 로 넣어 준다
ARG APP_VERSION=local
ENV NEXT_DEPLOYMENT_ID=${APP_VERSION} \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ───────── (CI 전용) 정적 파일만 꺼내기 ─────────
# docker buildx build --target static-assets --output type=local,dest=static-out .
# → static-out/_next/static/** 를 S3 에 올려 CloudFront 가 직접 서빙
# ⚠️ 이 단계를 파일 맨 끝에 두면 "--target 없는 빌드" 의 결과물이 이 빈 이미지가 된다
FROM scratch AS static-assets
COPY --from=builder /app/.next/static /_next/static

# ───────── 3단계: 실행 (최종 이미지 = 파일의 마지막 단계) ─────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ARG APP_VERSION=local
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    APP_VERSION=${APP_VERSION}
# standalone 결과물 + 정적 파일만 복사 (node_modules 전체를 넣지 않음)
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# root 가 아닌 node 사용자(uid 1000)로 실행
USER node
EXPOSE 3000
CMD ["node", "server.js"]
