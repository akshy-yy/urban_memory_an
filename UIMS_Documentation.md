# UIMS System Documentation

This document provides a comprehensive breakdown of every page, interface, and button functionality across the two main web portals of the Urban Infrastructure Memory System (UIMS).

---

## 1. Official Government Portal (`http://localhost:5173`)

This portal uses Role-Based Access Control (RBAC) and caters to System Administrators, Department Officials (e.g., PWD, Water Board), and Authenticated Citizens.

### A. Landing Page (`/` or `/gov`)
**Purpose:** The entry point to the system, featuring a dynamic satellite map background and explanations of UIMS core capabilities (Spatial De-confliction, Temporal Synchronization).
**Buttons & Actions:**
- **Open Dashboard / Official Sign In:** Navigates the user to the `/login` page. If they are already authenticated, it routes them directly to their respective dashboard.
- **Citizen Public Portal:** Opens `http://localhost:5174` in a new browser tab.
- **Sign In to Official Console:** Located at the bottom gateway section, navigates to `/login`.
- **Register Department Account:** Navigates to the `/register` page to create a new user.

### B. Login & Register Pages (`/login`, `/register`)
**Purpose:** Standard authentication forms handling JWT token generation and role assignment.
**Buttons & Actions:**
- **Sign In / Register:** Submits the form data to the Spring Boot backend (`http://localhost:8080`). On success, stores the JWT and redirects to the appropriate dashboard based on the user's role (`ROLE_ADMIN`, `ROLE_DEPARTMENT`, or `ROLE_CITIZEN`).

### C. Admin Dashboard (`/admin` or `/complaints`)
**Purpose:** Central control panel for System Administrators. Displays top-level metrics and monitors cross-department activities. It uses an advanced `BroadcastChannel` and local storage event listener to pull in live citizen complaints the second they are reported on the public portal.
**Buttons & Actions:**
- **Live Complaints Table Rows:** Visual hovering effects based on urgency (Level 1-10). Displays real-time incoming citizen grievances.
- **View All (System Logs):** Expands the "Recent Cross-Department Activity" table to view a full history of excavation proposals, conflicts, and resolutions.

### D. Department Operations Console (`/department` or `/projects`)
**Purpose:** Dashboard for department officials to monitor their active infrastructure works and track spatial conflicts. 
**Buttons & Actions:**
- **Details (Table Action):** Found on every project row. Clicking this opens the **Spatial Project Audit Modal**.
- **Spatial Project Audit Modal (Close / X):** This modal displays the exact corridor, dates, and a "Deconfliction Certificate" (verifying no overlapping excavations exist). The `Close Audit` button or `X` icon dismisses the modal.

### E. Authenticated Citizen Dashboard (`/citizen`)
**Purpose:** A private dashboard for registered citizens to track their officially lodged complaints.
**Buttons & Actions:**
- **Report New Issue:** Navigates the user to `/citizen/complaint/new` to fill out a formal, tracked grievance.

### F. Authenticated Citizen Complaint Form (`/citizen/complaint/new`)
**Purpose:** Standard web form for authenticated users to report potholes or damages.
**Buttons & Actions:**
- **Category & Road Dropdowns:** Select the type of issue and the affected road.
- **Cancel:** Discards the form and returns to the Citizen Dashboard.
- **Submit Complaint:** Sends a direct POST request to the backend database and alerts the user of success.

---

## 2. Citizen Public Portal (`http://localhost:5174`)

This is an unauthenticated, fully public portal designed for transparency. It integrates with mapping APIs to show live roadworks.

### A. Interactive Map Home (`/`)
**Purpose:** Displays a full-screen Leaflet interactive map (powered by Esri satellite tiles). It loads a pan-India dataset of active road works.
**Buttons & Actions:**
- **Search Bar:** Typing here dynamically filters the list of roadworks. If a match is found, the map automatically "flies" (pans and zooms) to the coordinate location.
- **Search Clear (X):** Clears the text input and resets the filter.
- **City Filter Chips (e.g., Bengaluru, Mumbai):** Clicking a chip instantly filters the active works to that specific city and refocuses the map camera to the city center.
- **Works List Card (Sidebar):** Clicking any specific project card in the left sidebar highlights it and flies the map camera directly over the construction zone.

### B. Raise Complaint with Automated Verification (`/raise-complaint`)
This portal allows citizens to lodge civic complaints directly via their smartphones.

- **Upload Image (`<input type="file">`):** Automatically triggers a backend call to the Python FastAPI ML Service (`/classify-road-image`). The system analyzes the photo to ensure it is actually a road/pothole and generates an automated `urgency_score` from 1-10.
- **Remove Photo & Try Again:** Appears if the system determines the image is NOT road-related (e.g., a picture of a cat). Clears the input so the user can upload a valid photo.
- **Submit Anyway (Manual Review):** Appears if the system rejects the image, allowing the user to bypass the filter and flag the complaint for manual human review by an Admin.
- **Submit Priority Complaint:** Finalizes the form. It saves the data locally and broadcasts an event that instantly appears on the Admin Dashboard (`http://localhost:5173/admin`).

### C. Policies & Live Data Info (`/policies`, `/live-data`)
**Purpose:** Informational routing pages that educate citizens on municipal guidelines (like the "Dig Once" policy) and explain where the live data on the map is sourced from (e.g., NHAI API Setu).
