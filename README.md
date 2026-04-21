# 🏥 MediCore Backend API

A full-stack hospital management backend built with **Node.js, Express, MongoDB (MERN)**.  
This API manages patients, doctors, and appointments with clean architecture and scalable design.

---

## 🚀 Features

- 👤 Patient Management (CRUD)
- 👨‍⚕️ Doctor Management (CRUD)
- 📅 Appointment Booking System
- 🔗 Relationships (Patient ↔ Doctor via Appointments)
- ⚠️ Centralized Error Handling
- ✅ Input Validation
- 🧠 Clean MVC Architecture

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- ES Modules
- dotenv
- CORS

---

## 📁 Project Structure

```
controllers/
models/
routes/
middleware/
utils/
config/
server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```
git clone <your-repo-link>
cd medicore-backend
```

---

### 2. Install Dependencies

```
npm install
```

---

### 3. Create `.env` File

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
```

---

### 4. Run Server

```
npm run dev
```

Server runs on:
```
http://localhost:5001
```

---

## 📡 API Endpoints

### 🧑 Patients

- `POST /api/patients` → Create patient  
- `GET /api/patients` → Get all patients  
- `PUT /api/patients/:id` → Update patient  
- `DELETE /api/patients/:id` → Delete patient  

---

### 👨‍⚕️ Doctors

- `POST /api/doctors` → Create doctor  
- `GET /api/doctors` → Get all doctors  
- `PUT /api/doctors/:id` → Update doctor  
- `DELETE /api/doctors/:id` → Delete doctor  

---

### 📅 Appointments

- `POST /api/appointments` → Create appointment  
- `GET /api/appointments` → Get all appointments  
- `PUT /api/appointments/:id` → Update appointment  
- `DELETE /api/appointments/:id` → Delete appointment  

---

## 🧪 Example Request (Create Appointment)

```json
{
  "patient": "PATIENT_ID",
  "doctor": "DOCTOR_ID",
  "appointmentDate": "2026-04-01T10:00:00.000Z",
  "reason": "Routine checkup"
}
```

---

## 📌 Notes

- Use valid MongoDB ObjectIds for patient & doctor
- `.env` file is not committed (security)
- MongoDB collections are created automatically on first insert

---

## 🤝 Collaboration

- Backend runs locally for development
- Share via GitHub
- Deploy after integration with frontend

---

## 🧠 Author

Abraham Ogbu

---

## 📄 License

ISC