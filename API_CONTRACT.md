# MPSA School ERP — API Contract & Backend Integration Specification

This document details the REST API endpoints, request/response schemas, MongoDB data models, and RBAC permissions required for the future backend phase to connect the newly designed frontend pages.

---

## 1. Homework & Assignments (`/homework`)

- **Permissions Required**: `homework.view`, `homework.manage`
- **MongoDB Collection**: `homeworks`

### Endpoints
1. `GET /api/homework`
   - **Query Params**: `className`, `subject`, `status`
   - **Response**:
     ```json
     [
       {
         "_id": "64f1a2b3...",
         "title": "Algebra Quadratic Equations Ex 4.2",
         "subject": "Mathematics",
         "className": "10-A",
         "teacher": "Ramesh Sharma",
         "assignedDate": "2026-09-05",
         "dueDate": "2026-09-10",
         "instructions": "Complete exercise 4.2 questions 1 to 10 in homework notebook.",
         "submissionsCount": 32,
         "totalStudents": 38,
         "status": "Active"
       }
     ]
     ```

2. `POST /api/homework`
   - **Request Payload**:
     ```json
     {
       "title": "Light & Optics Ray Diagram Worksheet",
       "subject": "Physics",
       "className": "12-A",
       "teacher": "Sunita Verma",
       "dueDate": "2026-09-12",
       "instructions": "Draw ray diagrams for concave and convex mirrors."
     }
     ```
   - **Response**: `201 Created` with created object.

3. `DELETE /api/homework/:id`
   - **Response**: `{ "message": "Homework deleted successfully" }`

---

## 2. Library Management (`/library`)

- **Permissions Required**: `library.view` (all users), `library.manage` (Librarian/Admin)
- **MongoDB Collection**: `books`, `book_issues`

### Endpoints
1. `GET /api/library/books`
   - **Query Params**: `search`, `category`, `status`
   - **Response**:
     ```json
     [
       {
         "_id": "64f1a9c4...",
         "bookCode": "BK-1001",
         "title": "Concepts of Physics Vol 1",
         "author": "H.C. Verma",
         "isbn": "978-8177091877",
         "category": "Science",
         "totalCopies": 15,
         "availableCopies": 11,
         "status": "Available"
       }
     ]
     ```

2. `POST /api/library/books`
   - **Request Payload**: Title, Author, ISBN, Category, Total Copies.

3. `POST /api/library/issue`
   - **Request Payload**: `bookId`, `borrowerName`, `borrowerType` (Student/Teacher), `dueDate`.

---

## 3. Parent Communication Center (`/parent-communication`)

- **Permissions Required**: `notices.view`, `notices.create`
- **MongoDB Collection**: `parent_messages`

### Endpoints
1. `GET /api/parent-communication/history`
   - **Response**: Array of past broadcast logs.

2. `POST /api/parent-communication/broadcast`
   - **Request Payload**:
     ```json
     {
       "title": "Fee Reminder - Q3 Term Installment",
       "targetClass": "Class 10-A",
       "channel": "WhatsApp & SMS",
       "message": "Dear parents, please clear pending tuition fees by 15th Sept."
     }
     ```

---

## 4. Notices & Announcements (`/notices`)

- **Permissions Required**: `notices.view`, `notices.manage`
- **MongoDB Collection**: `notices`

### Endpoints
1. `GET /api/notices`
   - **Query Params**: `audience`, `status`
   - **Response**: List of notice cards.

2. `POST /api/notices`
   - **Request Payload**: Title, Content, Audience (`All`, `Students`, `Teachers`, `Parents`), Expiry Date.

---

## 5. Student Certificates (`/certificates`)

- **Permissions Required**: `students.view`, `students.edit`
- **MongoDB Collection**: `certificates`

### Endpoints
1. `GET /api/certificates`
   - **Query Params**: `studentId`, `type`
2. `POST /api/certificates/generate`
   - **Request Payload**: Student ID, Certificate Type (`Transfer Certificate`, `Bonafide`, `Character`), Conduct, Reason.

---

## 6. Transport Management (`/transport`)

- **Permissions Required**: `transport.view`, `transport.manage`
- **MongoDB Collection**: `transport_routes`

### Endpoints
1. `GET /api/transport/routes`
2. `POST /api/transport/routes`

---

## 7. Inventory & Asset Management (`/inventory`)

- **Permissions Required**: `inventory.view`, `inventory.manage`
- **MongoDB Collection**: `inventory_items`

### Endpoints
1. `GET /api/inventory/items`
2. `POST /api/inventory/items`
3. `PATCH /api/inventory/items/:id/stock`

---

## 8. Student Health Records (`/health-records`)

- **Permissions Required**: `students.view` (restricted view), `students.edit`
- **MongoDB Collection**: `student_health`

### Endpoints
1. `GET /api/health-records`
2. `POST /api/health-records`

---

## 9. Reports & Analytics Center (`/reports`)

- **Permissions Required**: `reports.view`
- **Endpoints**: Aggregate endpoints for Student, Fee, Attendance, and Exam data export.

---

## 10. Audit & Activity Log (`/activity-log`)

- **Permissions Required**: `settings.manage`
- **MongoDB Collection**: `audit_logs`

### Endpoints
1. `GET /api/activity-log`
