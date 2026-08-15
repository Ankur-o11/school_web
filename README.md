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
