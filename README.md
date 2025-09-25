# TMTC Backend - Travel Itinerary API

This repository contains a Node.js + Express + MongoDB backend for managing travel itineraries.

## Features
- JWT Authentication (register/login)
- Itinerary CRUD (create, read, update, delete)
- Pagination, sorting and filtering
- Redis caching for single itinerary GET (5 minute TTL)
- Shareable public links for itineraries
- Jest + Supertest tests for auth and itinerary flows
- Docker & docker-compose for easy local development

## Quick start (development)
1. Copy `.env.example` to `.env` and adjust values.
2. Start services with Docker:
   ```bash
   docker-compose up --build
   ```
3. App will be available on http://localhost:5001

## Run tests locally
Tests expect a local MongoDB instance on default port (or adjust tests).
Install dependencies:
```bash
npm install
npm test
```

## API Endpoints (summary)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/itineraries
- GET /api/itineraries
- GET /api/itineraries/:id
- PUT /api/itineraries/:id
- DELETE /api/itineraries/:id
- POST /api/itineraries/:id/share
- GET /api/itineraries/share/:shareId

For full details, see controllers and routes.

## Notes
- Shareable links are stored in-memory for demo purposes. Persist to DB for production.
- Rate limiting is applied globally.
