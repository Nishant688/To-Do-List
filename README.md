# 📋 TaskFlow - Modern Full-Stack Productivity & Task Management Web Application

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.16-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

---

## 📖 Overview

**TaskFlow** is a modern, responsive, full-stack productivity web application designed to streamline personal and team workflow management. It combines an intuitive user interface with robust RESTful APIs, real-time status filtering, drag-and-drop Kanban boards, persistent user settings, and end-to-end JWT authentication.

Whether you prefer a high-level **Dashboard** summary, structured **List View**, or tactile **Kanban Board**, TaskFlow adapts seamlessly to your productivity style.

---

## ✨ Key Features

### 📊 1. Intelligent Dashboard
- **Dynamic Personalized Greeting**: Greets the user based on the time of day with live date headers and active task summaries.
- **Quick Add Bar**: Quickly input and schedule tasks for today by typing and pressing `Enter`.
- **Live Metric Cards**: Instant calculation of **Total Tasks**, **Completed**, **Pending**, and **Overdue** items directly from MongoDB.
- **Today & Due Soon Widgets**: Categorized overview of urgent actions and upcoming milestones.

### 📝 2. Comprehensive Task Management
- **Dual View Modes**: Switch between **List View** and **Kanban Board** with a single click.
- **Advanced Filtering**: Filter by Status (**All**, **Active**, **Completed**), Priority (**Low**, **Medium**, **High**), or Category.
- **Real-Time Search & Sorting**: Instant substring search across titles, descriptions, and categories; sort by Due Date, Priority, Title, or Created Date.
- **CRUD Operations**: Full modal dialogs for creating, editing, and deleting tasks with form validation and confirmation safeguards.

### 📋 3. Interactive Kanban Board
- **Three-Column Workflow**: **To Do**, **In Progress**, and **Done** columns with dynamic task counter badges.
- **HTML5 Drag-and-Drop**: Drag task cards across columns with smooth drop animations and instant database status synchronization.
- **Rich Card Details**: Visual priority chips (`HIGH`, `MED`, `LOW`), pastel category labels, and relative due date indicators (`Today`, `1d overdue`, `Tomorrow`).

### 👤 4. Profile & Preferences
- **Customizable Preferences**: Toggle between Light/Dark themes, set your preferred default view (List/Board), choose calendar start day (Monday/Sunday), and toggle email notifications.
- **Account Security**: Change password with validation of the current credentials.
- **Cascade Deletion**: Clean account removal with automatic cascade cleanup of associated tasks.

### 🔒 5. Security & Authentication
- **JSON Web Tokens (JWT)**: Secure authentication with stateless token-based authorization.
- **Password Protection**: Industry-standard password hashing via `bcryptjs`.
- **Protected Routing**: Frontend route guards preventing unauthorized navigation, plus Axios interceptors for automatic Bearer token injection and session expiry handling.
- **1-Click Demo Login**: Pre-configured demo button for instant evaluation without manual typing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js (ES Modules), Express.js, Mongoose ODM, Morgan, CORS, Dotenv |
| **Database** | MongoDB (Local Community Server or MongoDB Atlas Cloud) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Architecture** | RESTful API, Controller-Service Pattern, Optimistic UI Updates |

---

## 📁 Project Architecture

```
ToDoList/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection logic
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, session validation
│   │   │   ├── taskController.js     # Task CRUD, calculated metrics, status transitions
│   │   │   └── userController.js     # Profile updates, password changes, preferences
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT token verification guard
│   │   │   └── errorMiddleware.js    # Global error response handler
│   │   ├── models/
│   │   │   ├── User.js               # User schema, password hashing hooks
│   │   │   └── Task.js               # Task schema, status & date validations
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth endpoints
│   │   │   ├── taskRoutes.js         # /api/tasks endpoints
│   │   │   └── userRoutes.js         # /api/users endpoints
│   │   ├── seed/
│   │   │   └── seed.js               # Demo dataset seeding script (Maya Chen + sample tasks)
│   │   └── app.js                    # Express app configuration & middleware pipeline
│   ├── server.js                     # Server entry point
│   ├── test-e2e.js                   # Automated 15-point verification test suite
│   ├── .env.example                  # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Modal, Badge, ConfirmModal, Skeleton loaders
│   │   │   ├── layout/               # Sidebar, Navigation bar, Responsive container
│   │   │   ├── dashboard/            # Metric cards, Quick-add, Task widgets
│   │   │   ├── tasks/                # Task row items, Filter toolbar, Task form modal
│   │   │   ├── board/                # Kanban columns and draggable cards
│   │   │   └── profile/              # Profile cards, Theme & Preference controls
│   │   ├── context/                  # AuthContext, TaskContext, ToastContext
│   │   ├── pages/                    # Dashboard, Tasks, Board, Profile, Login, Register, 404
│   │   ├── services/                 # Axios client, Auth, Task, and User services
│   │   ├── utils/                    # Date calculations, badge formatting
│   │   ├── App.jsx                   # Route declarations & global providers
│   │   ├── main.jsx                  # Application root mount
│   │   └── index.css                 # Custom styles, animations, and Tailwind directives
│   ├── vite.config.js                # Vite development server & reverse proxy
│   ├── tailwind.config.js            # Custom design tokens and color scheme
│   ├── .env.example                  # Frontend environment template
│   └── package.json
│
├── .gitignore                        # Git ignore rules for node_modules, secrets, and builds
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (`v18.0.0` or higher)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY-NAME>.git
cd <YOUR-REPOSITORY-NAME>
```

---

### Step 2: Backend Setup & Seeding

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided template:
   ```bash
   # Windows PowerShell
   copy .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

4. Configure your environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. Seed the database with the pre-configured demo user and realistic sample tasks:
   ```bash
   npm run seed
   ```

6. Start the backend API server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:5000`.*

---

### Step 3: Frontend Setup

1. Open a new terminal tab/window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create your `.env` file from `.env.example`:
   ```bash
   # Windows PowerShell
   copy .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🔑 Demo Account Credentials

You can sign in immediately using the seeded demo account:

| Field | Value |
|---|---|
| **Email** | `maya.chen@example.com` |
| **Password** | `password123` |

> 💡 **Quick Tip**: You can also click the **"✨ Click to auto-fill Maya Chen demo account"** button directly on the login page for instantaneous 1-click access!

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user session |
| `POST` | `/api/auth/logout` | Public | Invalidate client session |

### 📌 Task Operations (`/api/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Private | Fetch tasks (supports `status`, `priority`, `category`, `search`, `sort`) |
| `GET` | `/api/tasks/stats` | Private | Calculate real-time stats (`total`, `completed`, `pending`, `overdue`, `dueToday`, `dueSoon`) |
| `GET` | `/api/tasks/:id` | Private | Fetch a specific task by ID |
| `POST` | `/api/tasks` | Private | Create a new task |
| `PUT` | `/api/tasks/:id` | Private | Update task details (title, description, priority, category, due date) |
| `PATCH` | `/api/tasks/:id/status` | Private | Update task status (`todo`, `in_progress`, `done`) for Kanban drop |
| `PATCH` | `/api/tasks/:id/complete` | Private | Toggle task completion checkbox |
| `DELETE` | `/api/tasks/:id` | Private | Permanently delete a task |

### ⚙️ User Settings & Profile (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Private | Retrieve profile information |
| `PUT` | `/api/users/profile` | Private | Update name, email, or avatar |
| `PUT` | `/api/users/password` | Private | Update password (requires current password verification) |
| `PUT` | `/api/users/preferences` | Private | Update theme, default view, week start day, email alerts |
| `DELETE` | `/api/users/account` | Private | Delete account and cascade-remove all user tasks |

---

## 🧪 Automated Testing

A 15-point End-to-End API verification script is included:

```bash
cd backend
node test-e2e.js
```

### Verified Test Cases:
- [x] API Health & Database Connectivity
- [x] JWT Token Generation & Login Flow
- [x] Authenticated Session Retrieval (`/api/auth/me`)
- [x] Live Statistical Aggregation from MongoDB
- [x] Substring Search & Priority Filtering
- [x] Task Creation & Schema Validation
- [x] Kanban Status Flow via `PATCH`
- [x] Checkbox Completion & Status Synchronization
- [x] Task Updating via `PUT`
- [x] Task Deletion via `DELETE`
- [x] Preferences Update (Theme, Default View, Calendar, Notifications)
- [x] New User Registration
- [x] Account Deletion with Cascade Task Cleanup

---

## 📦 Production Deployment

### Frontend (e.g. Vercel, Netlify)
```bash
cd frontend
npm run build
# The optimized production build is generated in `frontend/dist`
```

### Backend (e.g. Render, Railway, DigitalOcean, Heroku)
- Set environment variables in your hosting provider's dashboard:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI=<your-mongodb-atlas-connection-string>`
  - `JWT_SECRET=<your-strong-production-secret>`
  - `CLIENT_URL=<your-production-frontend-url>`
- Start script: `npm start` (`node server.js`)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it for personal and commercial projects.
