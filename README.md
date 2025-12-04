# ✅ API Testing Tool — Frontend

Frontend web application for the API Testing Tool built with **React, Vite, TailwindCSS, Monaco Editor, and Supabase Auth**.

---

## 🚀 Live App
```
https://api-testing-tool-five.vercel.app
```

---

## 🏗 Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| Vite | Fast build tool |
| TailwindCSS | Styling |
| Monaco Editor | JSON editor |
| Supabase | Authentication |
| Vercel | Deployment |

---

## 🔐 Authentication

This app uses **Supabase Auth** for:
- Login
- Signup
- Session persistence
- Access protection

Unauthorized users are redirected automatically.

---

## 📦 Features

- ✅ REST API Client (like Postman)
- ✅ Auth (Signup/Login)
- ✅ GET / POST / PUT / DELETE / PATCH
- ✅ Headers Editor
- ✅ Params Editor
- ✅ JSON Request Body Editor
- ✅ Import/Export Requests
- ✅ API History
- ✅ Collections
- ✅ Environments
- ✅ Dark / Light Mode
- ✅ Monaco Code Editor
- ✅ Secure proxy
- ✅ Response Viewer

---

## 📁 Project Structure

```
src/
 ├─ components/
 │  ├─ ApiForm.jsx
 │  ├─ Sidebar.jsx
 │  ├─ Navbar.jsx
 │  ├─ ResponseViewer.jsx
 │  ├─ EnvPanel.jsx
 │  └─ ProtectedRoute.jsx
 │
 ├─ pages/
 │  ├─ Home.jsx
 │  └─ About.jsx
 │
 ├─ lib/
 │  └─ api.js
 │
 ├─ utils/
 │  └─ envResolver.js
 │
 ├─ AuthPage.jsx
 ├─ MainLayout.jsx
 ├─ App.jsx
 └─ supabaseClient.js
```

---

## ⚙️ Environment Variables

Create `.env` file in root:

```
VITE_BACKEND_URL=https://api-testing-tool-backend-fyzg.onrender.com
VITE_SUPABASE_URL=your_supabase_project
VITE_SUPABASE_ANON_KEY=your_anon_key
```

⚠️ `.env` SHOULD NOT BE COMMITTED (Already in `.gitignore`)

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

App runs at:
```
http://localhost:5173
```

---

## 📤 Deployment (Vercel)

### Build Command:
```
npm run build
```

### Output Directory:
```
dist
```

### Add environment variables in Vercel:
- VITE_BACKEND_URL
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

---

## ✅ Security

- Auth-protected pages
- Token-secured backend requests
- Safe request forwarding
- Enforced CORS rules
- No secrets in frontend

---

## 🎯 Roadmap

- ✅ Monoco JSON validator
- ✅ Export collections
- ✅ Header presets
- ✅ Collaboration mode
- ✅ API performance graphs
- ✅ Team-based collections

---

## 👨‍💻 Maintained By
API Testing Tool Team
