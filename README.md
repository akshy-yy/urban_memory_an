# Urban Infrastructure Memory System (UIMS)

**Urban Infrastructure Memory System (UIMS)** is an integrated digital governance and GIS tracking platform designed to eliminate uncoordinated road-digging, track road quality lifecycles ("Road Passports"), streamline departmental project proposals, and empower citizens with real-time transparency on public infrastructure works.

---

## System Architecture

The project is structured into three independent, decoupled modules:

```
├── backend/            # Spring Boot 3 REST API + MySQL + JWT Authentication
├── frontend/           # Official Government Portal (Admins & Department Officials)
├── citizen-portal/     # Public Citizen Portal (Interactive Satellite Maps & Road Trackers)
├── docker-compose.yml  # Containerized MySQL database setup
├── start-uims.bat      # One-click startup script for Windows
└── README.md
```

---

## Key Features

### 1. Citizen Portal (`http://localhost:5174`)
- **Interactive Satellite Map:** Leaflet-powered GIS map layered with high-resolution **Esri World Imagery** satellite tiles for viewing active roadworks.
- **Road Passport Quick View:** Click on any road pin to inspect real-time field status, responsible authority (PWD, Metro Water, NDMC, NHAI), and live status updates.
- **Search & Filter:** Instant location filtering to focus and zoom the satellite camera directly onto specific construction zones.
- **Live Trackers Hub:** Information aggregation from national networks including **Mappls / NHAI API Setu**, Google Maps traffic layers, **ROADS INDIA**, and State PWD systems.
- **Government Policies:** Public transparency on standard municipal policies such as the **"Dig Once" Policy** and road opening guidelines.

### 2. Official Portal (`http://localhost:5173`)
- **Role-Based Access Control:** Distinct views and permissions for **System Administrators** and **Department Officials**.
- **Department Dashboard:** Propose new road-cutting projects, submit timeline estimates, and prevent road excavation conflicts across departments.
- **Admin Dashboard:** Cross-department approval workflows, road life cycle monitoring, and conflict detection analytics.
- **Citizen Complaint Management:** Official ticketing pipeline to review and action citizen-reported road damage/potholes.
- **Instant Registration & Login:** Direct authentication with role switching and local demo authentication mock fallback.

### 3. Spring Boot Backend (`http://localhost:8080`)
- **RESTful API:** Endpoints for authentication (`/api/auth`), departments, road projects, conflict resolution, and complaints.
- **Database:** JPA / Hibernate with MySQL integration (with automated table creation).
- **Security:** Stateless authentication using JSON Web Tokens (JWT) and BCrypt password encryption.

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended) & **npm**
- **Java JDK 17+** & **Maven** (optional if using the portable JDK or running frontend in demo mode)
- **Git**

---

### Quick Start (One-Click)

On Windows, simply double-click the **`start-uims.bat`** file in the root folder, or execute it in PowerShell/CMD:

```cmd
.\start-uims.bat
```

This will automatically launch three terminals in parallel:
1. **Backend API:** `http://localhost:8080`
2. **Official Portal:** `http://localhost:5173`
3. **Citizen Portal:** `http://localhost:5174`

---

### Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*(Or use `backend\build_and_run.bat` if using a portable JDK)*

#### 2. Official Portal Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Citizen Portal Setup
```bash
cd citizen-portal
npm install
npm run dev -- --port 5174
```

---

## Demo and Test Credentials

For quick testing on the Official Portal (`http://localhost:5173/login`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@uims.gov.in` | `admin123` |
| **PWD Department Official** | `pwd@uims.gov.in` | `pwd123` |

*You can also click **"Register here"** on the login page to create custom accounts on the fly.*

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React
- **Maps & GIS:** Leaflet, React-Leaflet, Esri World Imagery
- **Backend:** Java 17, Spring Boot 3 (Web, Data JPA, Security, Validation)
- **Database:** MySQL / H2
- **Tools:** Docker Compose, Maven

---

## License
Developed as part of the Software Engineering Project for Urban Infrastructure Management.
