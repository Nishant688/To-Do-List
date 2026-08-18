# 📋 TaskFlow - Full-Stack Task & Workflow Management App (MERN)

A modern full-stack productivity and task management web application built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS. Users can manage tasks with dynamic dashboard metrics, interactive list and drag-and-drop Kanban board views, custom priority/category filters, and secure JWT authentication.

---

## 🚀 Core Views
- **Dashboard**: Real-time task statistics, quick-add bar, today's schedule, and upcoming deadlines.
- **Tasks List View**: Interactive task rows, priority badges, category chips, search bar, and sorting.
- **Kanban Board**: Three-column drag-and-drop workflow (To Do, In Progress, Done) with instant database sync.
- **Profile & Settings**: Dark/Light mode toggle, preferences customizer, password manager, and account deletion.

---

## 🛠️ Tech Stack

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **React Router DOM v6**
- **Lucide React** (Icons)
- **Axios** (with JWT Interceptors)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose ODM**
- **JWT Authentication** (`jsonwebtoken`)
- **Password Hashing** (`bcryptjs`)
- **Morgan & CORS**

### Mobile (iOS & Android)
- **React Native** & **Expo SDK 52**
- **TypeScript**
- **React Navigation** (Bottom Tabs + Stack)
- **Lucide React Native**
- **Axios** (with JWT Interceptors)
- **AsyncStorage**

### Database & Deployment
- **MongoDB Community / MongoDB Atlas**
- **Vercel / Netlify** (Web)
- **Render / Railway** (Backend API)
- **Expo EAS Build** (Mobile APK / iOS)

---

## ⚡ Features
- 🔐 **JWT Authentication**: Secure signup, login, and protected API routes.
- 📱 **Cross-Platform Parity**: React web app + native React Native mobile app sharing the same MongoDB database.
- 📊 **Dynamic Dashboard Metrics**: Live calculation of total, completed, pending, and overdue tasks.
- ⚡ **Quick-Add Task Bar**: Instantly schedule tasks for today with a single press of `Enter`.
- 📋 **Interactive Kanban Board**: Drag-and-drop cards between To Do, In Progress, and Done columns with instant sync.
- 🔍 **Real-Time Search & Filtering**: Substring search with filters for status, priority, and category.
- 🎨 **Theme & Custom Preferences**: Light/Dark theme switch, default view selector, and calendar customization.
- 🔑 **1-Click Demo Login**: Pre-seeded demo account for instant access without manual registration.
- 📱 **Fully Responsive UI**: Native mobile UX with safe area, touch feedback, and responsive layout.

---

## 📂 Project Structure

```
ToDoList/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Auth, task & user business logic
│   │   ├── middleware/      # JWT auth guard & error handlers
│   │   ├── models/          # User & Task Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── seed/            # Demo database seeder script
│   ├── server.js            # Express server entry point
│   ├── test-e2e.js          # 15-point automated test suite
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (board, dashboard, tasks, profile)
│   │   ├── context/         # Auth, Task & Toast state contexts
│   │   ├── pages/           # Dashboard, Tasks, Board, Profile, Auth pages
│   │   ├── services/        # Axios API client & service modules
│   │   ├── utils/           # Date and badge formatting helpers
│   │   └── App.jsx          # Route declarations
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── components/      # Native mobile UI components
    │   ├── context/         # Native Auth, Task & Theme contexts
    │   ├── navigation/      # React Navigation (Tabs + Stacks)
    │   ├── screens/         # Dashboard, Tasks, Board, Profile, Auth screens
    │   ├── services/        # Mobile Axios API client
    │   ├── theme/           # Native color tokens & dark/light palettes
    │   └── utils/           # Date & status formatting helpers
    ├── App.tsx              # Root component
    ├── app.json             # Expo configuration
    ├── package.json
    └── README.md
```

---

## 🔐 Authentication Flow
1. **Signup** → Password hashed using `bcryptjs` before saving to MongoDB.
2. **Login** → Credentials verified and signed JWT token returned.
3. **Storage** → Token stored securely in `localStorage`.
4. **Interceptors** → Axios automatically attaches `Authorization: Bearer <token>` to all requests.
5. **Route Protection** → Unauthenticated users are redirected to login.

---

## 📋 Kanban & Task Sync Flow
1. User drags task card to a new column (**To Do** / **In Progress** / **Done**).
2. Optimistic UI update instantly moves the card on screen.
3. Backend receives `PATCH /api/tasks/:id/status` and updates MongoDB.
4. Dashboard counters and metrics re-calculate in real time.

---

## 🗃️ Database Models

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    defaultView: { type: String, enum: ['list', 'board'], default: 'list' },
    weekStartsOn: { type: String, enum: ['monday', 'sunday'], default: 'monday' },
    emailReminders: { type: Boolean, default: true }
  }
}
```

### Task Model
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, default: 'Work' },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false }
}
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current authenticated user
- `POST /api/auth/logout` — Invalidate user session

### Tasks (`/api/tasks`)
- `GET /api/tasks` — Fetch tasks (supports filter, search, sort)
- `GET /api/tasks/stats` — Get calculated dashboard statistics
- `GET /api/tasks/:id` — Get single task details
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update full task
- `PATCH /api/tasks/:id/status` — Update Kanban status (`todo`, `in_progress`, `done`)
- `PATCH /api/tasks/:id/complete` — Toggle task completed boolean
- `DELETE /api/tasks/:id` — Delete task permanently

### Profile & Settings (`/api/users`)
- `GET /api/users/profile` — Get profile info
- `PUT /api/users/profile` — Update name/email
- `PUT /api/users/password` — Change password
- `PUT /api/users/preferences` — Update theme and view preferences
- `DELETE /api/users/account` — Delete account and cascade-remove tasks

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=/api
```

---

## 🚦 Run Locally

### 1. Clone Repository
```bash
git clone https://github.com/Nishant688/To-Do-List.git
cd To-Do-List
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo account (maya.chen@example.com / password123)
npm run dev      # Runs API on http://localhost:5000
```

### 3. Frontend Setup (Web)
```bash
cd ../frontend
npm install
npm run dev      # Runs web app on http://localhost:5173
```

### 4. Mobile Setup (iOS & Android)
```bash
cd ../mobile
npm install
npm start        # Starts Expo dev server (scan QR code in Expo Go app)
```

---

## 🔑 Demo Account Credentials

| Field | Value |
|---|---|
| **Email** | `maya.chen@example.com` |
| **Password** | `password123` |

*(Or click the **"✨ Click to auto-fill Maya Chen demo account"** button directly on the login page!)*

---

## 💡 Learning Outcomes
- Architected a full-stack MERN application with RESTful design patterns.
- Implemented robust JWT authentication with Axios token interceptors and password hashing.
- Built interactive Drag-and-Drop Kanban boards with optimistic UI updates.
- Designed relational Mongoose schemas with pre-save hooks and cascade deletions.
- Developed a comprehensive responsive UI with Tailwind CSS and custom dark/light themes.

---

## 🌟 Future Improvements
- 🔔 Push and browser notifications for upcoming task deadlines.
- 👥 Multi-user team workspace and shared boards.
- 📎 File attachments on task cards.
- 🏷️ Custom user-defined tag labels and color pickers.
