# 🍜 Street Food Web App

A full-stack web application for managing street food orders, menu items, payments, and delivery flow. Built with modern technologies to support customers, staff, and admin operations efficiently.

---

## 📌 Features

### **👤 Customer**

* Browse food menus
* Add items to cart
* Place orders
* Make payments (supports pending → success update)
* Track order status

### **🛒 Admin / Staff**

* Manage menu items
* Manage orders
* Confirm payments
* Handle delivery (remain & complete)
* View order details

### **🌐 System**

* Authentication (Login / Token-based)
* REST API integration
* Zustand for state management (frontend)
* Secure backend routing
* Database storage (MongoDB/MySQL depending on your version)

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* Vite
* Tailwind CSS / Flowbite
* Zustand
* Axios API calls

### **Backend**

* Node.js
* Express.js
* MongoDB / Mongoose
* JWT Authentication

---

## 📂 Project Structure

```
Street_Food_Web_App/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── services/api.js
│   └── index.html
│
└── Backend/
    ├── model/
    ├── controller/
    ├── routes/
    ├── config/
    └── server.js
```

---

## ⚙️ Installation

### **Backend**

```bash
cd Backend
npm install
npm run dev
```

### **Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in `/Backend`:

```
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
```

---

## 🚀 Deployment

You can deploy using:

* **Frontend:** Netlify / Vercel
* **Backend:** Railway / Render / VPS
* **Database:** MongoDB Atlas

---

## 🙌 Credits

Developed by **Nyein Hsu Thwe**
Junior Web Developer – React.js · Node.js · TypeScript 

---

## 📄 License

This project is for educational & portfolio purposes.

