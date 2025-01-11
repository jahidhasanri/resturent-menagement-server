# Job Management API

This project is a **Job Management API** built using **Express.js**, **MongoDB**, and **JWT authentication**. The API provides various routes for handling job-related operations like adding jobs, updating jobs, purchasing jobs, and fetching job data. It also includes user authentication via **JSON Web Tokens (JWT)** for secure access.

---

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Job Management**:
  - Add new jobs.
  - Update existing job details.
  - Purchase jobs.
  - Fetch job data.
- **Data Storage**: MongoDB is used for storing all job and user-related data.
- **Cross-Origin Requests**: Handled with CORS for smooth integration with front-end clients.

---

## Prerequisites

Before running the project, make sure you have:

- **Node.js** (v16 or higher) installed.
- **MongoDB** (locally or cloud-based).
- A `.env` file with the following variables:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
