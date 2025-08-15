
## Description
Tracksy API is the backend service powering the Tracksy task management system. It handles authentication, role-based authorization, task CRUD operations, dashboard analytics, and user management. Built with Node.js and Express, it uses MongoDB for persistence and JWT for secure user sessions. The API is designed for scalability, modularity, and developer-friendly integration.

## Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Bearer Tokens)
- **File Uploads:** Multer
- **API Testing & Documentation:** Postman

## Key Features
- **Authentication & Authorization** — Secure login, signup, and token validation with role-based access control.
- **Task Management** — Create, read, update, and delete tasks with priority, status, due dates, and assigned users.
- **Todo Checklists** — Track subtasks within each task for granular progress.
- **Dashboard Reports** — Generate statistics, charts, and recent activity for both admins and individual users.
- **User Management (Admin Only)** — Create, update, and delete users.
- **Overdue Task Detection** — Identify and count overdue tasks automatically.
- **Optimized Queries** — Use MongoDB aggregation pipelines for analytics endpoints.

## API Endpoints Overview

### Auth
- **POST** `/api/v1/auth/register` — Register a new user.
- **POST** `/api/v1/auth/login` — Login and receive JWT token.

### Tasks
- **POST** `/api/v1/tasks` — Create a new task.
- **GET** `/api/v1/tasks` — Get all tasks.
- **GET** `/api/v1/tasks/:id` — Get a single task by ID.
- **PUT** `/api/v1/tasks/:id` — Update a task.
- **DELETE** `/api/v1/tasks/:id` — Delete a task.

### Reports
- **GET** `/api/v1/tasks/dashboard-report` — Admin dashboard statistics and recent tasks.
- **GET** `/api/v1/tasks/user-dashboard-report` — User-specific dashboard data.

## Challenges & Solutions

### 1. Role-Based Access Control
**Challenge:** Enforcing permissions for different user roles without scattering logic across routes.  

**Solution:** Centralized middleware that validates roles before allowing access to protected routes.

---

### 2. Dashboard Performance
**Challenge:** Returning aggregated statistics, charts, and recent tasks efficiently.  

**Solution:** Implemented optimized MongoDB aggregation pipelines to minimize query time.

---

### 3. Token Expiry Handling
**Challenge:** Ensuring expired tokens can’t access protected resources.  

**Solution:** Middleware to validate JWT tokens, check expiry, and reject invalid requests.

---

### 4. Nested Task Data
**Challenge:** Managing subtasks (checklists) without complex joins.  

**Solution:** Embedded `todoChecklist` array inside task documents for efficient single-query updates.

## What I Learned
- Structuring a **scalable REST API** with modular controllers, models, and routes.
- Implementing **secure JWT authentication** with refresh strategies in mind.
- Leveraging **MongoDB aggregation** for analytics and reporting.
- Designing **nested schemas** for complex task structures without hurting performance.
- Maintaining **developer-friendly API docs** via Postman collections.

