<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# school_web
MPSA School Management System is a full-stack school management web application designed to digitally manage and organize the day-to-day administrative activities of a school. The system provides a centralized dashboard where school administrators can manage students, teachers, attendance, salaries, and other academic records.
# 🏫 MPSA School Management System

A full-stack **School Management System** built to digitally manage students, teachers, attendance, salaries, and other administrative activities of a school.

The project is designed to replace manual record-keeping with a centralized and easy-to-use digital management system.

---

## 📌 Project Overview

**MPSA School Management System** is a web-based application developed for managing the day-to-day administrative operations of a school.

The system provides separate modules for:

- 👨‍🎓 Student Management
- 👨‍🏫 Teacher Management
- 📅 Student Attendance
- 🧑‍🏫 Teacher Attendance
- 💰 Teacher Salary Management
- 📊 Salary Calculation
- 📝 Salary Payment Records

The application uses a **React.js frontend** and a **Node.js + Express.js backend** communicating through REST APIs.

---

## ✨ Features

### 👨‍🎓 Student Management

The student module allows the administrator to manage complete student information.

#### Student Details

- Student Name
- Father's Name
- Mother's Name
- Date of Birth
- Gender
- Aadhaar Number
- PAN Number
- Admission Number
- Admission Date
- Class
- Section
- Roll Number
- Mobile Number
- Alternate Mobile Number
- Address
- Student Status

#### Available Operations

- ➕ Add Student
- 👁️ View Student
- ✏️ Update Student
- 🗑️ Delete Student
- 🔍 Manage Student Records

---

## 👨‍🏫 Teacher Management

The teacher module allows the school administrator to maintain staff records.

### Teacher Information

- Teacher Name
- Father's Name
- Gender
- Date of Birth
- Mobile Number
- Alternate Mobile Number
- Email
- Address
- Qualification
- Subject
- Joining Date
- Employee ID
- Monthly Salary
- Employment Status

### Available Operations

- ➕ Add Teacher
- 👁️ View Teacher
- ✏️ Update Teacher
- 🗑️ Delete Teacher

---

# 📅 Student Attendance

The system provides digital attendance management for students.

### Attendance Status

- ✅ Present
- ❌ Absent
- 🟡 Leave

Each attendance record contains:

```text
Student ID
Date
Status
>>>>>>> 5759e48e80e6795ed738a055c724f343955418e4
