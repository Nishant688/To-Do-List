# 📱 TaskFlow Mobile App (React Native + Expo)

TaskFlow Mobile is a full-featured cross-platform mobile application for Android and iOS built with **React Native**, **Expo**, and **TypeScript**. It connects directly to the existing TaskFlow Express/MongoDB backend API, sharing the exact same database, user accounts, and tasks.

---

## ✨ Features

- 🔐 **JWT Authentication**: Login with 1-tap demo credentials (`maya.chen@example.com`), user registration, and secure token persistence via AsyncStorage.
- 📊 **Dynamic Mobile Dashboard**: Real-time stats (Total, Completed, Pending, Overdue) calculated from MongoDB, personalized greeting, date header, and quick-add bar.
- 📝 **Tasks Screen**: Segmented status tabs (All, Active, Completed), instant search, priority filters (High, Med, Low), category filters, and sorting (Due date, Priority, Title, Created date).
- 📋 **Kanban Board**: Horizontally swipeable columns (To Do, In Progress, Done) with quick-status movements that sync immediately with `PATCH /api/tasks/:id/status`.
- 🔍 **Task Details & Modals**: View full description, priority chips, pastel category badges, relative due date indicators, and edit/delete actions.
- 🎨 **Preferences & Themes**: Full Light / Dark mode switcher syncing with user profile in MongoDB, default view selector, week starts on selector, and email reminders toggle.
- 👤 **Profile & Security**: Edit profile name/email, change password with current password verification, log out, and cascade account deletion.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Language**: TypeScript with strict type checking
- **HTTP Client**: Axios with JWT request interceptors and auto 401 handling
- **Storage**: `@react-native-async-storage/async-storage`
- **Icons**: `lucide-react-native`
- **Safe Area**: `react-native-safe-area-context`

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (`v18.0.0` or higher)
- Backend running on `http://localhost:5000` (or reachable over local Wi-Fi)
- [Expo Go](https://expo.dev/go) app on your physical Android or iPhone (or Android Studio / Xcode emulators)

---

### 2. Configure Backend API URL

Open `mobile/.env` and ensure `EXPO_PUBLIC_API_URL` points to your backend:

```env
# For Physical Phone testing on the SAME Wi-Fi network:
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api

# Example (if your machine IP is 192.168.11.125):
EXPO_PUBLIC_API_URL=http://192.168.11.125:5000/api

# For Android Emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# For iOS Simulator:
# EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

> 💡 **Finding your Computer's Local IP:**
> - **Windows**: Open PowerShell and run `ipconfig` (look for *IPv4 Address* under Wi-Fi, e.g. `192.168.11.125`).
> - **macOS / Linux**: Run `ifconfig` or `hostname -I`.

---

### 3. Install & Start

```bash
cd mobile
npm install
npm start
```

Once Expo starts in your terminal:
- 📱 **Physical Phone**: Open the **Expo Go** app and scan the QR code displayed in the terminal.
- 🤖 **Android Emulator**: Press `a` in the terminal.
- 🍏 **iOS Simulator**: Press `i` in the terminal.

---

## 🔑 Demo Account Credentials

| Field | Value |
|---|---|
| **Email** | `maya.chen@example.com` |
| **Password** | `password123` |

*(You can also tap the **"✨ Auto-fill Maya Chen demo account"** button on the login screen for instant 1-tap sign-in!)*

---

## 📁 Mobile Project Structure

```
mobile/
├── assets/                  # App icon, splash screen, adaptive icon
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CategoryBadge.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── CustomCheckbox.tsx
│   │   ├── EmptyState.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── QuickAddBar.tsx
│   │   ├── StatCard.tsx
│   │   └── TaskCard.tsx
│   ├── context/             # Global React state providers
│   │   ├── AuthContext.tsx  # JWT authentication & session persistence
│   │   ├── TaskContext.tsx  # Optimistic task state & calculations
│   │   └── ThemeContext.tsx # Light/Dark theme switching
│   ├── navigation/          # Navigation navigators
│   │   ├── AuthNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── screens/             # Screen components
│   │   ├── auth/            # LoginScreen, RegisterScreen
│   │   ├── board/           # BoardScreen (Kanban)
│   │   ├── dashboard/       # DashboardScreen
│   │   ├── profile/         # ProfileScreen, EditProfileModal, ChangePasswordModal
│   │   └── tasks/           # TasksScreen, TaskDetailScreen, CreateTaskScreen, EditTaskScreen
│   ├── services/            # API communication layer
│   │   ├── api.ts           # Axios client with JWT interceptor
│   │   ├── authService.ts
│   │   ├── taskService.ts
│   │   └── userService.ts
│   ├── theme/               # Colors & design tokens
│   │   └── colors.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   └── utils/               # Date helpers & status formatting
│       └── dateUtils.ts
├── App.tsx                  # Main app entry & provider tree
├── app.json                 # Expo project manifest
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

---

## 📦 Production Builds (EAS Build)

To build standalone APKs or iOS release binaries with Expo Application Services (EAS):

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure the build:
   ```bash
   eas build:configure
   ```
4. Build Android APK:
   ```bash
   eas build -p android --profile preview
   ```
5. Build iOS App:
   ```bash
   eas build -p ios --profile preview
   ```
