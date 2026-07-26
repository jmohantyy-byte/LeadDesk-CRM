# LeadDesk CRM - API Documentation

## Overview

LeadDesk CRM is a Lead Management System developed using the MERN Stack. It provides secure authentication, role-based access control, lead management, assignment, notes, and activity tracking.

---

# Base URL

Production

https://leaddesk-crm.onrender.com

---

# Authentication

Authentication uses JSON Web Tokens (JWT).

After successful login, the server returns a JWT token.

Include the token in every protected request.

Authorization Header

Bearer <JWT_TOKEN>

---

# Roles

## Admin

- View all leads
- Assign leads
- Update lead status
- Add notes
- View activity timeline
- Manage users

## Member

- View assigned leads
- Update assigned lead status
- Add notes

---

# Status Codes

| Status | Meaning |
|---------|----------|
|200|Success|
|201|Created Successfully|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error|

---

# Authentication APIs

## Register User

POST

/api/admin/register

Request

```json
{
"name":"Janavi",
"email":"admin@gmail.com",
"password":"Admin@123",
"role":"admin"
}
```

Success

```json
{
"success":true,
"message":"User registered successfully"
}
```

---

## Login

POST

/api/admin/login

Request

```json
{
"email":"admin@gmail.com",
"password":"Admin@123"
}
```

Success

```json
{
"success":true,
"token":"JWT_TOKEN",
"role":"admin",
"name":"Janavi"
}
```

---

# Lead APIs

## Submit Lead

POST

/api/leads/submit

Authentication

No

Request

```json
{
"name":"Rahul",
"email":"rahul@gmail.com",
"budget":"5000",
"message":"Need website development"
}
```

Success

```json
{
"success":true,
"message":"Lead Submitted Successfully"
}
```

---

## Get All Leads

GET

/api/leads

Authentication

Yes

Admin Only

Supports

- Search
- Pagination
- Status Filter

---

## Get Assigned Leads

GET

/api/leads/member

Authentication

Required

Member Only

---

## Update Lead

PUT

/api/leads/:id

Authentication

Required

Example

```json
{
"status":"Contacted"
}
```

---

## Assign Lead

PUT

/api/leads/:id/assign

Authentication

Admin Only

Example

```json
{
"assignedTo":"USER_ID"
}
```

---

## Add Note

POST

/api/leads/:id/note

Authentication

Required

Request

```json
{
"note":"Customer requested callback tomorrow."
}
```

---

# Database Collections

Users

```
name
email
password
role
```

Leads

```
name
email
budget
message
status
assignedTo
notes
activity
createdAt
updatedAt
```

---

# Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role Based Authorization
- Environment Variables
- MongoDB Atlas

---

# Deployment

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

---

# Tech Stack

Frontend

- React
- Vite
- Tailwind CSS
- Axios

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

Deployment

- Vercel
- Render
- MongoDB Atlas

---

# Future Improvements

- Email Notifications
- File Upload Support
- Dashboard Analytics
- Export Leads
- Role Permissions
- Audit Logs
- Two Factor Authentication
