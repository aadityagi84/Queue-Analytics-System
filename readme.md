# Distributed Task Queue & Analytics System

**Senior Node.js Machine Test Submission**

## Overview

High-throughput backend service built with **Node.js + TypeScript** that handles transaction ingestion, asynchronous background processing using BullMQ, and optimized cached analytics reporting.

The system meets all core requirements:

- High-throughput ingestion with rate limiting
- Idempotent background worker with retries
- Optimized analytics with cache stampede protection
- Production-ready setup with graceful shutdown

## Features Implemented

- **High-Throughput Ingestion**: POST endpoint with Zod validation and immediate queue push
- **Idempotent Background Worker**: Processes transactions asynchronously with duplicate prevention
- **Optimized Analytics**: Cached summary with Redis lock for thundering herd protection
- **Database Operations**: Prisma ORM with support for atomic transactions
- **Production Readiness**: Error handling, logging, rate limiting, security headers, and graceful shutdown

## Tech Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Queue**: BullMQ + Redis
- **Database**: Prisma ORM (PostgreSQL / SQLite)
- **Cache**: Redis (ioredis)
- **Validation**: Zod
- **Middleware**: Helmet, CORS, Compression, Morgan, express-rate-limit

## Project Structure

```
     .
     ├── src/
     │   ├── config/
     │   │   └── redis.ts
     │   ├── db/
     │   │   └── prisma.ts
     │   ├── modules/
     │   │   ├── transaction/
     │   │   │   ├── transaction.controller.ts
     │   │   │   ├── transaction.route.ts
     │   │   └── analyticsService/
     │   │       ├── analytics.routes.ts
     │   │       └── analytics.service.ts
     │   ├── queue/
     │   │   ├── transactionQueue.ts
     │   │   └── worker.ts
     │   ├── middleware/
     │   │   └── rateLimiter.ts
     │   └── utils/
     │       ├── errorHandler.ts
     │       └── notFound.ts
     ├── prisma/
     │   └── schema.prisma
     ├── .env
     ├── tsconfig.json
     ├── package.json
     └── README.md
```

## Installation & Setup

**Clone the repository**

```bash
git clone <your-repo-url>
cd transaction-system
```

## Install dependenciesBash

```
npm install
```

## Database SetupBash

```
 npx prisma generate
 npx prisma migrate dev
 npx prisma db push

```

## Run Prisma StudioBash

```
npx prisma studio

npm run dev # Start with nodemon (development)

```
