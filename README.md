# Job Management API 📄

This project is a **Job Management API** built using `Express.js`, `MongoDB`, and `JWT Authentication`. The API allows users to manage job listings, purchase jobs, and perform other job-related operations while ensuring security with JSON Web Tokens (JWT). The project is designed to support a job management platform seamlessly.

---

## **Live API URL**
[Job Management API](https://assignment-11-solution-server.vercel.app/)

---

## **Features**

- **JWT Authentication**: Secure access to protected routes with token-based authentication.
- **Job Management**: Add, update, delete, and fetch job listings.
- **User Authentication**: Login and logout functionality using tokens.
- **Purchasing Jobs**: Enables users to purchase jobs, updates inventory, and tracks purchases.
- **Authorization**: Protects endpoints with JWT and ensures proper user access control.

---

## **Technologies Used**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Management**: dotenv
- **CORS**: Enables cross-origin requests

---

## **Dependencies**

```json
{
  "name": "assignment-11-solution-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.12.0"
  }
}
## Setup Instructions
**git clone https://github.com/yourusername/job-management-api.git**
**cd job-management-api**
**npm install**

## Create a .env file and Add your MongoDB connection string and JWT secret:
**MONGO_URI=your_mongodb_connection_string**
**JWT_SECRET=your_jwt_secret**
## Run the application
**npm start**
