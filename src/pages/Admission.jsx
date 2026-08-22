import React, { useState } from "react";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    gender: "",
    className: "",
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    address: "",
    previousSchool: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Admission form submitted successfully!");

    console.log(formData);
  };

  return (
    <div className="content-card">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <span style={{ fontSize: "38px" }}>🎓</span>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#172033",
            }}
          >
            Student Admissions
          </h1>

          <p
            style={{
              marginTop: "5px",
              color: "#718096",
            }}
          >
            Manage new student admissions from here.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e7ebf2",
          borderRadius: "15px",
          padding: "30px",
        }}
      >

        <h2
          style={{
            marginBottom: "25px",
            color: "#172033",
          }}
        >
          New Admission Form
        </h2>

        <form onSubmit={handleSubmit}>

          {/* STUDENT INFORMATION */}
          <h3 style={sectionTitle}>
            Student Information
          </h3>

          <div style={grid}>

            <div>
              <label style={label}>Student Name *</label>

              <input
                style={input}
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div>
              <label style={label}>Date of Birth *</label>

              <input
                style={input}
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={label}>Gender *</label>

              <select
                style={input}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={label}>Applying For Class *</label>

              <select
                style={input}
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

          </div>

          {/* PARENT INFORMATION */}
          <h3 style={sectionTitle}>
            Parent / Guardian Information
          </h3>

          <div style={grid}>

            <div>
              <label style={label}>Father's Name *</label>

              <input
                style={input}
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
                required
              />
            </div>

            <div>
              <label style={label}>Mother's Name *</label>

              <input
                style={input}
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Enter mother's name"
                required
              />
            </div>

            <div>
              <label style={label}>Mobile Number *</label>

              <input
                style={input}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div>
              <label style={label}>Email Address</label>

              <input
                style={input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

          </div>

          {/* ADDRESS */}
          <h3 style={sectionTitle}>
            Address & Previous School
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={label}>Complete Address *</label>

            <textarea
              style={{
                ...input,
                minHeight: "100px",
                resize: "vertical",
              }}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={label}>Previous School</label>

            <input
              style={input}
              type="text"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              placeholder="Enter previous school name"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "13px 25px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🎓 Submit Admission
          </button>

        </form>
      </div>
    </div>
  );
}


/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: "25px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#374151",
};

const input = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const sectionTitle = {
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #e5e7eb",
  color: "#1e3a8a",
};

export default Admission;