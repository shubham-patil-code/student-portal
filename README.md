# 🎓 Student Portal — React App

A full-featured student management portal built with **React + Vite**.

---

## 📁 Folder Structure

```
student-portal/
│
├── index.html                        ← HTML entry point (loads Vite + fonts)
├── vite.config.js                    ← Vite configuration
├── package.json                      ← Dependencies & scripts
│
└── src/
    │
    ├── main.jsx                      ← React root render
    ├── App.jsx                       ← Router setup (all routes live here)
    ├── index.css                     ← Global CSS variables & base styles
    │
    ├── context/
    │   └── AuthContext.jsx           ← Global auth state (login/logout/user/token)
    │
    ├── utils/
    │   ├── auth.js                   ← JWT encode/decode, localStorage helpers, isAuthenticated()
    │   └── api.js                    ← Axios instance + mock CRUD (fetchStudents, createStudent…)
    │
    ├── components/
    │   ├── ProtectedRoute.jsx        ← Redirects to /login if not authenticated
    │   ├── Layout.jsx                ← Shell wrapper (Sidebar + <Outlet />)
    │   ├── Layout.module.css
    │   ├── Sidebar.jsx               ← Nav links + user card + logout button
    │   ├── Sidebar.module.css
    │   ├── UI.jsx                    ← Reusable: Button, Input, Select, Badge,
    │   │                                         Spinner, Card, PageHeader, ConfirmDialog
    │   └── UI.module.css
    │
    └── pages/
        ├── Login.jsx                 ← Login form with validation + JWT storage
        ├── Login.module.css
        ├── Dashboard.jsx             ← Stats cards + recent students table + JWT info strip
        ├── Dashboard.module.css
        ├── Students.jsx              ← Full students list with search + delete
        ├── Students.module.css
        ├── StudentForm.jsx           ← Add / Edit form (shared, route-aware)
        └── StudentForm.module.css
```

---

## ✅ Features Checklist

| Feature                  | Location                          |
|--------------------------|-----------------------------------|
| Login Page               | `pages/Login.jsx`                 |
| JWT Token Storage        | `utils/auth.js` + `AuthContext`   |
| Protected Dashboard      | `components/ProtectedRoute.jsx`   |
| Add Student              | `pages/StudentForm.jsx` (add mode)|
| Update Student           | `pages/StudentForm.jsx` (edit mode)|
| Delete Student           | `pages/Students.jsx`              |
| Logout                   | `components/Sidebar.jsx`          |

---

## 🛠 Skills Used

| Skill              | Where                                   |
|--------------------|-----------------------------------------|
| React Router v6    | `App.jsx` — nested routes, Navigate     |
| Authentication     | `context/AuthContext.jsx`               |
| Protected Routes   | `components/ProtectedRoute.jsx`         |
| LocalStorage       | `utils/auth.js` — token + user persist  |
| CRUD + API         | `utils/api.js` — mock Axios service     |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

### Demo Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@portal.com         | admin123   |
| Teacher | teacher@portal.com       | teach123   |

---

## 🔑 How JWT Works in This App

1. User submits credentials → `loginUser()` verifies against mock users
2. `generateMockJWT()` creates a signed-looking Base64 token with expiry (8h)
3. Token saved to `localStorage` via `saveToken()`
4. Every Axios request attaches `Authorization: Bearer <token>`
5. `isAuthenticated()` checks token exists + not expired on every route
6. `ProtectedRoute` reads auth state and redirects if needed
7. Logout clears token + user from localStorage

---

## 📦 Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "axios": "^1.7",
  "jwt-decode": "^4"
}
```

> **Note:** Student data is persisted in `localStorage` under the key `sp_students`, so records survive page refreshes.
