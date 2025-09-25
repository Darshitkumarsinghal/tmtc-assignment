# TMTC Backend - Travel Itinerary API

A complete backend application built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT Authentication**, **Redis caching**, and **Dockerized setup**.  
This project was developed as part of the TMTC Backend Assignment.

---

## ✨ Features
- ✅ User Authentication (Register/Login) with JWT & bcrypt password hashing  
- ✅ CRUD for Travel Itineraries  
- ✅ Pagination, Filtering (by destination), and Sorting  
- ✅ MongoDB Indexing (`userId`, `destination`)  
- ✅ Redis caching for GET itinerary by ID (5 min expiry)  
- ✅ Shareable public links (no auth required)  
- ✅ Email notifications via **Nodemailer** (sent when an itinerary is created)  
- ✅ GraphQL endpoint (`/graphql`) for alternative queries  
- ✅ Jest + Supertest tests for Auth & Itineraries  
- ✅ Dockerfile + docker-compose for API + MongoDB + Redis  
- ✅ Rate limiting & error handling middleware  

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas (or local MongoDB)  
- **ORM:** Mongoose  
- **Authentication:** JWT (jsonwebtoken)  
- **Caching:** Redis (Redis Cloud / local Redis)  
- **Email:** Nodemailer (SMTP, e.g. Gmail App Passwords)  
- **GraphQL:** express-graphql + graphql  
- **Testing:** Jest, Supertest  
- **Docs:** Swagger (OpenAPI) + Postman Collection  

---

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/tmtc-assignment.git
cd tmtc-assignment
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file (copy `.env.example`) and configure:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tmtc
JWT_SECRET=yourSuperSecretKey

# Redis Cloud (use format with password)
REDIS_URL=redis://:<password>@redis-15635.c239.us-east-1-2.ec2.redns.redis-cloud.com:15635

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password   # 16-char Gmail App Password (no spaces)
```

### 4️⃣ Run with Docker (recommended)
```bash
docker-compose up --build
```

### 5️⃣ Run Locally
Make sure MongoDB & Redis are running locally, then:
```bash
npm run dev
```

App will run on: [http://localhost:5001](http://localhost:5001)

---

## 📡 API Endpoints (REST)

### Authentication
#### Register User
- **POST** `/api/auth/register`  
- **Body**
```json
{
  "name": "Darshit",
  "email": "test@example.com",
  "password": "123456"
}
```  
- **Response**
```json
{
  "_id": "user_id",
  "name": "Darshit",
  "email": "test@example.com",
  "token": "jwt_token"
}
```

#### Login User
- **POST** `/api/auth/login`  
- **Body**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```  
- **Response**
```json
{
  "_id": "user_id",
  "name": "Darshit",
  "email": "test@example.com",
  "token": "jwt_token"
}
```

---

### Itineraries
#### Create Itinerary
- **POST** `/api/itineraries`  
- **Headers**: `Authorization: Bearer <token>`  
- **Body**
```json
{
  "title": "Paris Trip",
  "destination": "Paris",
  "startDate": "2025-10-01",
  "endDate": "2025-10-05",
  "activities": [
    {
      "time": "10:00",
      "description": "Visit Eiffel Tower",
      "location": "Eiffel Tower"
    }
  ]
}
```

#### List Itineraries
- **GET** `/api/itineraries?page=1&limit=10&destination=Paris&sort=startDate`  
- **Headers**: `Authorization: Bearer <token>`  
- **Response**
```json
{
  "items": [
    {
      "_id": "itinerary_id",
      "title": "Paris Trip",
      "destination": "Paris",
      "startDate": "2025-10-01T00:00:00.000Z",
      "endDate": "2025-10-05T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### Get Itinerary by ID
- **GET** `/api/itineraries/:id`  
- **Headers**: `Authorization: Bearer <token>`

#### Update Itinerary
- **PUT** `/api/itineraries/:id`  
- **Headers**: `Authorization: Bearer <token>`  
- **Body**
```json
{
  "title": "Paris Trip Updated"
}
```

#### Delete Itinerary
- **DELETE** `/api/itineraries/:id`  
- **Headers**: `Authorization: Bearer <token>`

---

### Sharing
#### Create Shareable Link
- **POST** `/api/itineraries/:id/share`  
- **Headers**: `Authorization: Bearer <token>`  
- **Response**
```json
{
  "shareId": "xxxx-xxxx",
  "url": "/api/itineraries/share/xxxx-xxxx"
}
```

#### Access Shared Itinerary (Public)
- **GET** `/api/itineraries/share/:shareId`  
- **Response**
```json
{
  "title": "Paris Trip",
  "destination": "Paris",
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-05T00:00:00.000Z"
}
```

---

### Health Check
- **GET** `/health`  
- **Response**
```json
{ "ok": true }
```

---

## 📧 Email Notifications
Whenever a new itinerary is created, an email is sent to the user using Nodemailer.  
- Configured via `.env` (SMTP settings).  
- Gmail requires an **App Password** (not your normal Gmail password).  

---

## 🕸 GraphQL API
Alternative to REST.

**Endpoint:** `/graphql`

Example Query:
```graphql
{
  itineraries {
    _id
    title
    destination
  }
}
```

---

## 🧪 Testing
Run Jest + Supertest tests:
```bash
npm test
```

Tests cover:
- Authentication (register/login)  
- Itinerary CRUD (create & fetch)  

---

## 📑 API Documentation

### Postman Collection
A ready-to-use **Postman Collection** is provided (`postman_collection.json`).  
You can import it into Postman and run all endpoints easily.

---

## 🐳 Deployment on Render
- Render builds directly from `Dockerfile` (not docker-compose).  
- Use **MongoDB Atlas** + **Redis Cloud** (set via Render Env Vars).  
- Required ENV vars in Render:
  - `PORT`, `MONGO_URI`, `JWT_SECRET`, `REDIS_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`  

---

## 📬 Contact
Author: Darshit Singhal  
Repo: [https://github.com/Darshitkumarsinghal/tmtc-assignment](https://github.com/Darshitkumarsinghal/tmtc-assignment)
