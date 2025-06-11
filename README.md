# 🔧 Backend — Slacky Real-Time Chat App

This is the backend server for **Slacky**, a full-featured Slack-style messaging app.
Built using **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **JWT** for authentication.

---

## 🚀 Features

* Authentication (Sign Up, Login, Logout)
* JWT Token system (Access + Refresh tokens)
* Email verification system (Optional)
* Create / Join Workspaces
* Create / Join Channels
* Add members to workspace via email
* Real-time chat using Socket.IO
* Private & channel-based messaging
* Typing indicators
* Delete messages
* Upload images using Cloudinary (presigned URL)
* Secure password hashing
* Error handling & loaders

---

## 📁 Folder Structure

```bash
server/
├── config/             # DB connection, Cloudinary config, etc.
├── controllers/        # All route logic (auth, chat, workspace, etc.)
├── middleware/         # Auth middleware, error handlers
├── routes/             # API route definitions
├── schema/             # Mongoose schemas (User, Workspace, Channel, Message)
├── services/           # Email service, token service, etc.
├── utils/              # Helper functions
├── .env                # Environment variables
├── index.js           # App entry point
└── package.json        # Dependencies & scripts
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory:

```ini
PORT=3000''
DEV_DB_URL=''
JWT_SECRET_KEY=''
EXPIRY=''
MAIL_PASS=''
MAIL_ADD=''
REDIS_HOST=''
REDIS_PORT=''
ENABLE_EMAIL_VERIFICATION='false'
APP_LINK=
AWS_REGION=''
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
AWS_BUCKET_NAME=''
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''

```

---

## 📦 Install Dependencies

```bash
cd backend
npm install
```

---

## ▶️ Start the Server

```bash
npm start
```

Server runs at `http://localhost:3000`

---

## 🔗 API Base URL

```http
http://localhost:3000/api
```

---

## 📬 Example Endpoints

* `POST /api/auth/v1/users/signup`
* `POST /api/auth/v1/users/signin`
* `POST /api/v1/workspace/:id`
* `POST /api/v1/channel/:id`

---

## 🧪 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (JSON Web Token)
* Cloudinary
* Socket.IO
* Nodemailer (SMTP for email)

---

## 📌 Notes

* Email verification is optional and disabled in production by default.
* Make sure to set all required environment variables before running.
* Presigned image uploads reduce DB size and increase performance.

---

Feel free to contribute or fork the backend for your own real-time chat project!
