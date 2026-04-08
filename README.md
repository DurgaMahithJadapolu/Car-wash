# 🚗 SparkleWash — Car Wash Manager

Full-stack application with **MongoDB + Mongoose** backend and React frontend.

---

## 📁 Project Structure

```
sparklewash/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Login, signup, demo, logout
│   │   ├── bookingsController.js  # CRUD for bookings
│   │   └── usersController.js     # Profile, password, account
│   ├── middleware/
│   │   └── auth.js                # Token-based session middleware
│   ├── models/
│   │   ├── Booking.js             # Mongoose Booking schema
│   │   ├── Session.js             # Mongoose Session schema (TTL)
│   │   └── User.js                # Mongoose User schema (bcrypt)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── users.js
│   ├── scripts/
│   │   └── seed.js                # Seeds default admin user
│   ├── .env                       # Environment variables (git-ignored)
│   ├── .env.example               # Template for env vars
│   ├── package.json
│   └── server.js
└── frontend/                      # React app (unchanged)
    └── src/
        └── ...
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Configure Environment

The `.env` file is pre-configured. To customise, copy from the example:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/sparklewash?appName=..."
JWT_SECRET=your_secret_here
NODE_ENV=development
```

### 3. Seed Default Admin User

Run once to create the default admin account in MongoDB:

```bash
npm run seed
```

Default credentials: `admin@demo.com` / `admin123`

### 4. Start the Backend

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs at: `http://localhost:5000`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🗄️ MongoDB Models

### User
| Field      | Type   | Notes                        |
|------------|--------|------------------------------|
| name       | String | Required, min 2 chars        |
| email      | String | Required, unique, lowercase  |
| phone      | String | Optional                     |
| password   | String | Bcrypt-hashed before save    |
| role       | String | `user` or `admin`            |
| createdAt  | Date   | Auto (Mongoose timestamps)   |

### Booking
| Field     | Type   | Notes                                     |
|-----------|--------|-------------------------------------------|
| name      | String | Customer name                             |
| phone     | String | Contact number                            |
| email     | String | Contact email                             |
| vtype     | String | Vehicle type (Hatchback, Sedan, etc.)     |
| vnum      | String | Vehicle registration number               |
| vmod      | String | Vehicle model                             |
| svc       | String | Service name                              |
| svcVal    | String | Service value string (name\|price)        |
| amount    | Number | Amount charged                            |
| date      | String | Booking date (YYYY-MM-DD)                 |
| slot      | String | Time slot                                 |
| stat      | String | Pending / In Progress / Completed / Cancelled |
| pay       | String | Cash / Card / UPI / Online                |
| staff     | String | Assigned staff                            |
| promo     | String | Promo code used                           |
| notes     | String | Additional notes                          |
| createdBy | ObjectId | Ref to User                            |

### Session
| Field     | Type   | Notes                            |
|-----------|--------|----------------------------------|
| token     | String | Random 32-byte hex, unique       |
| userId    | String | ObjectId string or `'demo'`      |
| expiresAt | Date   | TTL index — auto-deleted after 7 days |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint          | Auth Required | Description        |
|--------|-------------------|---------------|--------------------|
| POST   | /api/auth/login   | No            | Login              |
| POST   | /api/auth/signup  | No            | Register           |
| POST   | /api/auth/demo    | No            | Demo login         |
| POST   | /api/auth/logout  | Yes           | Logout             |

### Bookings
| Method | Endpoint              | Auth Required | Description       |
|--------|-----------------------|---------------|-------------------|
| GET    | /api/bookings         | Yes           | Get all bookings  |
| POST   | /api/bookings         | Yes           | Create booking    |
| PUT    | /api/bookings/:id     | Yes           | Update booking    |
| DELETE | /api/bookings/:id     | Yes           | Delete booking    |

### Users
| Method | Endpoint              | Auth Required | Description         |
|--------|-----------------------|---------------|---------------------|
| GET    | /api/users/profile    | Yes           | Get profile         |
| PUT    | /api/users/profile    | Yes           | Update profile      |
| PUT    | /api/users/password   | Yes           | Change password     |
| DELETE | /api/users/account    | Yes           | Delete account      |

---

## 🔒 Security Notes

- Passwords are **bcrypt-hashed** (10 salt rounds) before storage — never stored in plain text
- Sessions use random 32-byte hex tokens stored in MongoDB with a 7-day TTL
- MongoDB TTL index automatically cleans up expired sessions
- All sensitive config (DB URI, secrets) lives in `.env` — never committed to git
- Add `.env` to your `.gitignore`

---

## 🔄 What Changed (v1 → v2)

| Before (v1)                     | After (v2)                             |
|---------------------------------|----------------------------------------|
| In-memory arrays (`store.js`)   | MongoDB via Mongoose                   |
| Plain-text passwords            | Bcrypt hashed passwords                |
| Sessions in JS object           | Sessions in MongoDB with TTL expiry    |
| No `.env` support               | Full `dotenv` integration              |
| No validation                   | Mongoose schema validation             |
| `data/store.js`                 | Removed — replaced by `models/`        |
