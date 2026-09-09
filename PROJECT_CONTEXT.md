# MPSA SCHOOL ERP - PROJECT CONTEXT

This document is the permanent technical project context and handover reference for MPSA School ERP. It details the actual codebase architecture, database structures, features, deployments, and rules for ongoing development.

---

## 1. Project Overview
**MPSA School ERP** (Maharana Pratap Science Academy Inter College) is a production-grade, full-stack School Management System built using standard web technologies. It provides administrative controls, student lifecycle management, public online admissions, dynamic academic results, fee structures, teacher payroll/attendance, and parent communication via WhatsApp.

- **Frontend Tech**: React 19, Vite 8, React Router 7, Vanilla CSS design system.
- **Backend Tech**: Node.js, Express 5, ES Modules.
- **Database**: MongoDB / MongoDB Atlas (using Mongoose 9 & native MongoDB driver).
- **Authentication**: JWT token authentication with RBAC (Role-Based Access Control) permissions.
- **Hosted Platforms**: Vercel (Frontend), Render (Backend).

---

## 2. Frontend
- **Framework**: React `^19.2.8` with Vite `^8.2.0` (SPA architecture).
- **Routing**: `react-router-dom` `^7.18.2`.
- **Folder Structure**:
  - `src/pages/`: Page components (`Login.jsx`, `Dashboard.jsx`, `Admission.jsx`, `PublicOnlineAdmission.jsx`, `PublicAdmissionStatus.jsx`, `ParentCommunication.jsx`, `student.jsx`, `teacher.jsx`, `fees.jsx`, etc.).
  - `src/components/`: Shared UI components (`Sidebar.jsx`, `topbar.jsx`, `ProtectedRoute.jsx`, `WhatsAppModal.jsx`, `BulkWhatsAppModal.jsx`).
  - `src/components/ui/`: Reusable design system primitives (`PageHeader.jsx`, `StatCard.jsx`, `DataTable.jsx`, `StatusBadge.jsx`, `ActionMenu.jsx`, `Modal.jsx`, `EmptyState.jsx`).
  - `src/Style/`: Modular CSS files (`ui.css`, `sidebar.css`, `topbar.css`, `login.css`, `whatsapp-modal.css`).
  - `src/context/`: `AuthContext.jsx` handling JWT tokens, user state, permissions, and `fetchWithAuth` wrapper.
  - `src/config/`: `api.js` (centralized API URL handling).
  - `src/services/`: `whatsappService.js` (phone normalization and WhatsApp URL generation).
- **Environment Variables**: `VITE_API_URL` (optional override for backend endpoint).
- **API Configuration ([`src/config/api.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/config/api.js))**:
  - Automatically targets `http://localhost:5000` in dev mode.
  - In production, falls back to `https://school-web-hng4.onrender.com`.
  - Sanitizes and exports `API_BASE_URL` ending with `/api`.
- **Vercel Production URL**: `https://school-web-rouge-nine.vercel.app`

---

## 3. Backend
- **Framework**: Node.js with Express `^5.2.1` using native ES Modules (`"type": "module"`).
- **Server Entry**: [`server/server.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/server.js).
- **Modular Directory Architecture (`server/modules/`)**:
  - Each domain feature resides in its own isolated module directory with standard architectural subcomponents:
    - `admissions/` (`admissions.routes.js`, `admissions.controller.js`, `admissions.service.js`, `admissions.model.js`)
    - `students/` (`students.routes.js`, `students.controller.js`, `students.model.js`)
    - `communications/` (`communications.routes.js`, `communications.controller.js`, `communications.service.js`, `communications.model.js`)
    - `auth/` (`auth.routes.js`, `auth.controller.js`, `auth.model.js`)
    - `users/`, `rolesPermissions/`, `teachers/`, `teacherAttendance/`, `teacherSalary/`, `activityLog/`, `subjects/`, `results/`, `classes/`, `fees/`, `attendance/`
- **Middleware**:
  - `cors({ origin: true, credentials: true })`
  - `express.json({ limit: "10mb" })`
  - `server/middleware/auth.js` (`authenticateToken`, `requirePermission`, `requireRole`)
- **Main API Routes**:
  - `/api/auth`
  - `/api/admissions`
  - `/api/students`
  - `/api/communications`
  - `/api/fees`
  - `/api/results`
  - `/api/student-attendance`
  - `/api/teachers`, `/api/teacher-salary`, `/api/teacher-attendance`
  - `/api/classes`, `/api/subjects`, `/api/users`, `/api/roles-permissions`

---

## 4. Database
- **Engine**: MongoDB / MongoDB Atlas using Mongoose & Native MongoDB Driver.
- **Connection Logic ([`server/config/database.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/config/database.js))**:
  - Environment variable `MONGODB_URI` connects to database `mpsa_school`.
  - Database instance shared across controllers via app locals (`app.locals.db`) or dedicated setters (`setStudentsDatabase`, `setAdmissionsDatabase`).
- **Main Collections**:
  - `students`: Stores enrolled student records (Name, Admission No, Roll, Class, Section, Father Name, Parent Phone, Status).
  - `admissions`: Stores registration applications (Immutable `applicationNo`, `trackingToken`, source: `online`/`admin`/`walk-in`, status: `Submitted`/`Correction Required`/`Verified`/`Confirmed`, checklist, pending items).
  - `fees`: Stores student fee transactions, breakdown, total fee, paid fee, and pending fee.
  - `student_attendance`: Stores daily attendance logs (Present/Absent/Leave/Late).
  - `results`: Stores examination marks, subject grades, and term evaluation reports.
  - `communicationLogs`: Logs all prepared/opened/skipped WhatsApp messages with timestamps and sentBy user metadata.
  - `communicationTemplates`: Stores reusable message templates with double-curly string interpolation (`{{studentName}}`, `{{pendingFee}}`, etc.).
  - `users`, `roles_permissions`, `teachers`, `teacher_attendance`, `teacher_salary`.

*Note: Security rules strictly forbid outputting raw passwords, connection strings, or JWT secrets in repository files.*

---

## 5. Authentication & Permissions
- **Login Flow**:
  - Endpoint: `POST /api/auth/login` accepting username/email and password.
  - Generates JWT token signed with secret (`JWT_SECRET`).
  - Frontend stores token in `localStorage` under key `mpsa_token` and user object under `mpsa_user`.
- **Protected Routes**:
  - Client: [`src/components/ProtectedRoute.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/components/ProtectedRoute.jsx) checks token validity and user permissions before rendering pages.
  - Server: `authenticateToken` middleware verifies Bearer token header on protected endpoints.
- **Public Routes (Unprotected by Design)**:
  - `/login`: Admin / Staff ERP sign in.
  - `/online-admission`: Public online student registration form.
  - `/admission-status/:id`: Public parent tracking and correction page (uses secure `trackingToken` or `applicationNo`).
- **CRITICAL SECURITY RULE**: Authentication must NEVER be disabled or bypassed to fix an API or UI error.

---

## 6. Deployment
- **GitHub Repository**: `https://github.com/Ankur-o11/school_web.git`
- **Branch**: `main`
- **Frontend Deployment (Vercel)**:
  - URL: `https://school-web-rouge-nine.vercel.app`
  - SPA Rewrites: Configured via [`vercel.json`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/vercel.json) (`/(.*)` -> `/index.html`).
- **Backend Deployment (Render)**:
  - URL: `https://school-web-hng4.onrender.com`
  - Production Base API: `https://school-web-hng4.onrender.com/api`
- **Environment Variables**:
  - Server: `PORT`, `MONGODB_URI`, `JWT_SECRET`
  - Client: `VITE_API_URL`

---

## 7. Admissions System
The Admissions module is a complete lifecycle solution:
1. **Public Online Admission** (`/online-admission`): Parents submit student details without logging in.
2. **Backend Application ID**: Immutable format (e.g. `MPSA-2026-XXXXXX`) generated securely on the server.
3. **Tracking Token**: 32-character hex random string created for safe public URL tracking (`/admission-status/:token`).
4. **Correction Request Workflow**: Admins can request correction with notes $\rightarrow$ parent visits tracking link, sees notice, and resubmits updated info.
5. **Document & Fee Verification**: Admins toggle verification checklists (Aadhaar, TC, Birth Certificate, Marksheet, Admission Fee).
6. **Confirm & Create Student**: 1-click conversion creates an official student record in the `students` collection and links `admissionId` & `applicationId`.
7. **Admin Filtering**: Supports filtering by Source (`Online`, `Admin`, `Walk-in`) and Status (`Submitted`, `Correction Required`, `Verified`, `Confirmed`, `Rejected`).
8. **Sidebar Shortcut**: Navigating to `/admissions?source=online` automatically pre-filters the list for Online Self-Service applications.

---

## 8. Online Admission
- **Route**: `/online-admission` (renders [`PublicOnlineAdmission.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/PublicOnlineAdmission.jsx)).
- **Form Fields**: Student Name, Gender, Date of Birth, Applied Class, Father/Parent Name, Parent Mobile Number, Email, Residential Address, Previous School.
- **Client & Server Validation**: Validates required fields and 10-digit Indian mobile formats.
- **Submission API**: `POST /api/admissions/online`.
- **Success View**: Displays generated Application ID, parent tracking link, and direct WhatsApp notification action.
- **Parent Tracking Page**: `/admission-status/:id` (renders [`PublicAdmissionStatus.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/PublicAdmissionStatus.jsx)).

---

## 9. Parent Communication / WhatsApp
- **Normalization Helper** ([`whatsappService.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/services/whatsappService.js) & [`server/utils/whatsappService.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/utils/whatsappService.js)):
  - Converts formats (`9876543210`, `+919876543210`, `919876543210`, `09876543210`, `+91 98765 43210`, `98765-43210`) into normalized `919876543210` without double-prepending `91`.
  - Preserves original phone numbers in MongoDB.
- **Parent Phone Fallback Hierarchy**:
  - `parentPhone || fatherMobile || motherMobile || phone || contact || mobile || alternateMobile`
- **Particular Student WhatsApp**:
  - Accessible via `💬` button in Students table or "Particular Student WhatsApp" tab in [`ParentCommunication.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/ParentCommunication.jsx).
  - Admins pick message type: **Fee Details**, **Attendance Report**, **Report Card**, or **General Notice**.
  - Fetches real MongoDB compilation (`POST /api/communications/compile-student`) and displays preview before launching `wa.me` URL.
- **Class-Wise Broadcast Runner**:
  - Compiles real DB data for entire classes/sections (`POST /api/communications/compile-bulk`).
  - Launches sequential click-to-send modal runner (`Current: X / Y`) to prevent browser tab crashes or Meta WhatsApp spam flags.
- **Audit Logging**: Every action logged to `communicationLogs` (`POST /api/communications/log`).

*Note on Implementation: Automated background/headless WhatsApp sending without user clicks is explicitly avoided to comply with standard WhatsApp policies and prevent domain blocking.*

---

## 10. Students
- **Page**: [`src/pages/student.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/student.jsx).
- **Backend Route**: `/api/students`.
- **Features**: Full CRUD, admission linking, active/inactive status toggle, class/section filtering, global search (Name, Admission No, Roll, Father Name, Phone), parent WhatsApp shortcut `💬` modal launcher.

---

## 11. Teachers
- **Page**: `src/pages/teacher.jsx` & `src/pages/TeachersManagement.jsx`.
- **Backend Routes**: `/api/teachers`, `/api/teacher-attendance`, `/api/teacher-salary`.
- **Features**: Staff records, designation, qualification, subject allocation, monthly attendance logging, salary calculation & slip generation.

---

## 12. Results
- **Pages**: `src/pages/Results.jsx` & `src/pages/Exams.jsx`.
- **Backend Route**: `/api/results`, `/api/subjects`.
- **Features**: Real MongoDB storage for exam schedules, subject-wise marks entry, total/percentage computation, grade assignment, report card preview, and WhatsApp summary generator for parents.

---

## 13. Fees
- **Page**: `src/pages/fees.jsx`.
- **Backend Route**: `/api/fees`.
- **Features**: Academic session fee structure definition, student fee collection, receipt generation, pending balance tracking, fee reminder compilation.

---

## 14. Attendance
- **Pages**: `src/pages/Attendence.jsx` (Student) & `src/pages/TeacherAttendance.jsx` (Staff).
- **Backend Routes**: `/api/student-attendance`, `/api/teacher-attendance`.
- **Features**: Class-wise daily register marking (Present, Absent, Late, Leave), percentage statistics, automated absent notification triggers.

---

## 15. Timetable
- **Page**: `src/pages/Timetable.jsx`.
- **Backend Route**: `/api/timetable` (or MongoDB class schedule records).
- **Features**: Weekly period grid creation per class/section, teacher slot allocation, conflict checking.

---

## 16. Important Routes

| Route | Purpose | Authentication Required |
| :--- | :--- | :--- |
| `/login` | Staff / Admin ERP Sign in | ❌ Public |
| `/online-admission` | Public Student Admission Application Form | ❌ Public |
| `/admission-status/:id` | Public Parent Admission Tracking & Correction | ❌ Public |
| `/` | ERP Main Executive Dashboard | ✅ Required |
| `/admissions` | Admin Admissions Portal & Application Processing | ✅ Required (`admissions.view`) |
| `/admissions?source=online` | Pre-filtered Online Admission Applications | ✅ Required (`admissions.view`) |
| `/students` | Enrolled Student Directory & Management | ✅ Required (`students.view`) |
| `/parent-communication` | WhatsApp Center (Single Student & Class Broadcast) | ✅ Required (`notices.view`) |
| `/teachers` | Faculty Directory & Staff Management | ✅ Required (`teachers.view`) |
| `/fees` | Fee Structure & Transaction Management | ✅ Required (`fees.view`) |
| `/results` | Exam Marks, Grades & Report Cards | ✅ Required (`results.view`) |
| `/attendance` | Student Daily Attendance Register | ✅ Required (`attendance.view`) |
| `/timetable` | Master Class & Section Schedule | ✅ Required (`timetable.view`) |

---

## 17. Important Files

| File / Path | Purpose |
| :--- | :--- |
| [`src/App.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/App.jsx) | Main React Router setup and route protection wrappers |
| [`src/pages/Login.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/Login.jsx) | Login form & public Online Admission CTA banners |
| [`src/pages/Dashboard.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/Dashboard.jsx) | ERP Executive Dashboard with statistics & quick shortcuts |
| [`src/pages/Admission.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/Admission.jsx) | Admin Admissions Portal for processing applications |
| [`src/pages/PublicOnlineAdmission.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/PublicOnlineAdmission.jsx) | Public self-service online application form for parents |
| [`src/pages/PublicAdmissionStatus.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/PublicAdmissionStatus.jsx) | Public parent tracking & correction submission page |
| [`src/pages/ParentCommunication.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/ParentCommunication.jsx) | Parent WhatsApp Communication Center & Broadcast Wizard |
| [`src/pages/student.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/pages/student.jsx) | Student Directory with inline WhatsApp trigger button |
| [`src/components/sidebar.jsx`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/components/sidebar.jsx) | Main ERP Sidebar navigation with Online Applications submenu |
| [`src/config/api.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/src/config/api.js) | Centralized environment API base URL resolution |
| [`server/server.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/server.js) | Express backend entry point, database connection, & router bindings |
| [`server/modules/admissions/`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/modules/admissions/) | Admissions backend module (Routes, Controller, Service, Model) |
| [`server/modules/communications/`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/modules/communications/) | Real DB message compilation & logging backend module |
| [`server/utils/whatsappService.js`](file:///c:/Users/Singh/OneDrive/Desktop/MPSA-SCHOOL/server/utils/whatsappService.js) | Backend phone normalization & wa.me URL generator |

---

## 18. Current Deployment URLs
- **Frontend (Vercel Production)**: `https://school-web-rouge-nine.vercel.app`
- **Backend (Render Production)**: `https://school-web-hng4.onrender.com`
- **Backend API Base**: `https://school-web-hng4.onrender.com/api`

---

## 19. Recent Changes
- `d5829be`: `feat(admissions): add visible public online admission CTA buttons and admin sidebar submenu`
- `9e45f6a`: `fix(communication): resolve invalid whatsapp number normalization, parent phone fallback, and student whatsapp triggers`
- `3eb6ce8`: `feat: complete production upgrade of Admissions, Online Portal, and Parent Communication Center`
- `b7ef933`: `fix(admissions): resolve setAdmissionsDatabase export and render startup crash`
- `3415533`: `fix(admissions): resolve API 404 route method mismatch and normalize JSON response keys`
- `75d7e29`: `feat: complete automated admission workflow, WhatsApp tracking links, and auto student creation`
- `fcf5285`: `fix(auth): update all component API calls to use fetchWithAuth and pass Bearer token`

---

## 20. Known Issues / Limitations
- None currently active. All admissions, authentication, phone normalization, parent communications, and deployment routes have been fixed, verified, and tested cleanly.

---

## 21. Development Commands
- **Install Dependencies**: `npm install`
- **Start Local Frontend Dev Server**: `npm run dev`
- **Start Local Backend Server**: `npm run server` or `node server/server.js`
- **Build Production Frontend**: `npm run build`
- **Check Server Syntax**: `node --check server/server.js`

---

## 22. AI Instructions

When a future AI agent opens this project:

1. **Read `PROJECT_CONTEXT.md` first.**
2. **Inspect the actual code before making assumptions.**
3. **Do not create duplicate modules/pages.**
4. **Reuse existing components, APIs, and services where possible.**
5. **Do not disable authentication or security to solve problems.**
6. **Do not expose secrets.**
7. **Do not replace working functionality unnecessarily.**
8. **Check MongoDB/backend integration before changing frontend behavior.**
9. **After major changes run the appropriate build/syntax tests.**
10. **Explain exactly which files were changed.**
11. **Do not claim a feature works unless it was actually tested.**
12. **Preserve existing deployment architecture unless explicitly asked to change it.**

---

## 23. How to Continue Work

A future AI agent starting on this project should follow this exact checklist:

1. Read `PROJECT_CONTEXT.md`.
2. Inspect `git status`.
3. Inspect recent git commits using `git log -n 5`.
4. Inspect relevant existing files using file viewing tools.
5. Understand the current implementation and architecture.
6. Make the requested change carefully without breaking existing features.
7. Run `npm run build` to verify frontend compilation.
8. Run `node --check server/server.js` to verify backend syntax.
9. Check API/database integration when relevant.
10. Report changed files and test results clearly to the user.
