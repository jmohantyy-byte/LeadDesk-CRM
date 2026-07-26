# LeadDesk CRM

LeadDesk CRM is a full-stack Lead Management System built using the MERN stack. It allows businesses to capture leads, manage them through different stages, assign them to team members, and track activities securely using role-based authentication.

## Features

- Public lead capture form
- JWT Authentication
- Role-based access (Admin & Member)
- Lead status management
- Lead assignment
- Notes with timestamps
- Activity timeline
- Responsive UI

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```
frontend/
backend/
API_DOCUMENTATION.md
TASK_B.md (or TASK_B folder)
README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/jmohantyy-byte/LeadDesk-CRM.git
cd LeadDesk-CRM
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

## Live Demo

Frontend:
https://lead-desk-crm-lemon.vercel.app

Backend:
https://leaddesk-crm.onrender.com

## Test Credentials

### Admin

Email:
admin@gmail.com

Password:
Your Admin Password

### Member

Email:
member@gmail.com

Password:
Your Member Password

## API Documentation

See `API_DOCUMENTATION.md`

## Task B

See the `TASK_B` documentation.

## Future Improvements

- Email notifications
- Dashboard analytics
- Export leads
- File uploads
- Two-factor authentication
- Advanced reporting
