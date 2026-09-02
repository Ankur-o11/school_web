
import React, { useEffect, useMemo, useState } from "react";
import "../Style/admission.css";

const API = "http://localhost:5000";

const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const sessions = ["2026-27", "2027-28", "2028-29"];

const emptyForm = {
  session: "2026-27",
  admissionType: "New",
  studentName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  className: "",
  section: "",
  fatherName: "",
  motherName: "",
  phone: "",
  alternateMobile: "",
  email: "",
  address: "",
  previousSchool: "",
  aadhaar: "",
  penNo: "",
  admissionDate: new Date().toISOString().split("T")[0],
  admissionNo: "",
  receiptNo: "",
  rollNo: "",
};

function Admission() {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [successStudent, setSuccessStudent] = useState(null);

  const schoolName = useMemo(() => {
    if (["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5"].includes(formData.className)) {
      return "MAHARANA PRATAP SCIENCE ACADEMY UCCHATAR MADHIMIK JALAUN";
    }

    return "MAHARANA PRATAP SCIENCE ACADEMY INTER COLLEGE JALAUN";
  }, [formData.className]);

  const isPrimary = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5"].includes(
    formData.className
  );

  useEffect(() => {
    loadNextReceipt();
  }, []);

  const loadNextReceipt = async () => {
    try {
      setReceiptLoading(true);

      const response = await fetch(`${API}/api/admissions/next-receipt`);
      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          receiptNo: data.receiptNo,
        }));
      }
    } catch (error) {
      console.error("Receipt loading error:", error);
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = async () => {
    setFormData({
      ...emptyForm,
      session: "2026-27",
      admissionDate: new Date().toISOString().split("T")[0],
    });

    await loadNextReceipt();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.studentName.trim() ||
      !formData.fatherName.trim() ||
      !formData.motherName.trim() ||
      !formData.dob ||
      !formData.gender ||
      !formData.className ||
      !formData.section ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.admissionDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const studentData = {
        name: formData.studentName.trim(),
        father: formData.fatherName.trim(),
        mother: formData.motherName.trim(),

        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,

        aadhaar: formData.aadhaar.trim(),
        penNo: formData.penNo.trim(),

        admissionNo: formData.admissionNo.trim(),
        admissionDate: formData.admissionDate,

        session: formData.session,
        admissionType: formData.admissionType,

        class: formData.className,
        section: formData.section,
        rollNo: formData.rollNo.trim(),

        mobile: formData.phone.trim(),
        alternateMobile: formData.alternateMobile.trim(),

        email: formData.email.trim(),
        address: formData.address.trim(),
        previousSchool: formData.previousSchool.trim(),

        receiptNo: formData.receiptNo,

        status: "Active",
      };

      const response = await fetch(`${API}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admission failed");
      }

      setSuccessStudent(data.student);

      alert(
        `Admission successful!\n\nStudent: ${data.student.name}\nReceipt No: ${data.student.receiptNo}`
      );

      await resetForm();
    } catch (error) {
      console.error("Admission error:", error);

      alert(
        error.message ||
          "Unable to save admission. Please check backend server."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admission-page">

      {/* SCHOOL HEADER */}
      <div className="admission-school-header">

        <div className="school-emblem">🎓</div>

        <div>
          <h1>{schoolName}</h1>

          <p>
            NEW ADMISSION FORM
          </p>

          <span>
            Session {formData.session}
          </span>
        </div>

      </div>

      {/* TOP INFO */}
      <div className="admission-top-bar">

        <div>
          <span>Form Type</span>
          <strong>Student Admission</strong>
        </div>

        <div>
          <span>Admission Type</span>
          <strong
            className={
              formData.admissionType === "New"
                ? "new-badge"
                : "old-badge"
            }
          >
            {formData.admissionType} Student
          </strong>
        </div>

        <div>
          <span>Receipt No.</span>
          <strong>
            {receiptLoading
              ? "Generating..."
              : formData.receiptNo || "Auto"}
          </strong>
        </div>

      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        {/* SESSION */}
        <section className="admission-card">

          <div className="section-heading">
            <div className="section-icon">📅</div>

            <div>
              <h2>Admission Session & Type</h2>
              <p>Select academic session and admission category</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>Academic Session *</label>

              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
              >
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Student Type *</label>

              <select
                name="admissionType"
                value={formData.admissionType}
                onChange={handleChange}
              >
                <option value="New">New Student</option>
                <option value="Old">Old Student</option>
              </select>
            </div>

            <div className="form-field">
              <label>Admission Date *</label>

              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Receipt Number</label>

              <input
                type="text"
                name="receiptNo"
                value={formData.receiptNo}
                readOnly
                className="readonly-field"
              />
            </div>

          </div>
        </section>

        {/* STUDENT INFORMATION */}
        <section className="admission-card">

          <div className="section-heading">
            <div className="section-icon">👨‍🎓</div>

            <div>
              <h2>Student Information</h2>
              <p>Enter complete student personal information</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>Student Name *</label>

              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student's full name"
              />
            </div>

            <div className="form-field">
              <label>Date of Birth *</label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Gender *</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Blood Group</label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-field">
              <label>Class *</label>

              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                <option value="">Select Class</option>

                {classes.map((item) => (
                  <option key={item} value={item}>
                    {item === "Nursery" ||
                    item === "LKG" ||
                    item === "UKG"
                      ? item
                      : `Class ${item}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Section *</label>

              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="form-field">
              <label>Roll Number</label>

              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="Enter roll number"
              />
            </div>

            <div className="form-field">
              <label>Admission Number</label>

              <input
                type="text"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                placeholder="e.g. MPSA-2026-001"
              />
            </div>

          </div>
        </section>

        {/* PARENT */}
        <section className="admission-card">

          <div className="section-heading">
            <div className="section-icon">👨‍👩‍👦</div>

            <div>
              <h2>Parent / Guardian Information</h2>
              <p>Enter parent and contact details</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>Father's Name *</label>

              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
              />
            </div>

            <div className="form-field">
              <label>Mother's Name *</label>

              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Enter mother's name"
              />
            </div>

            <div className="form-field">
              <label>Mobile Number *</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </div>

            <div className="form-field">
              <label>Alternate Mobile</label>

              <input
                type="tel"
                name="alternateMobile"
                value={formData.alternateMobile}
                onChange={handleChange}
                placeholder="Enter alternate mobile"
              />
            </div>

            <div className="form-field">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

          </div>
        </section>

        {/* IDENTITY */}
        <section className="admission-card">

          <div className="section-heading">
            <div className="section-icon">🪪</div>

            <div>
              <h2>Identity Information</h2>
              <p>Government and school identification details</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>Aadhaar Number</label>

              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="Enter Aadhaar number"
                maxLength="12"
              />
            </div>

            <div className="form-field">
              <label>PEN Number</label>

              <input
                type="text"
                name="penNo"
                value={formData.penNo}
                onChange={handleChange}
                placeholder="Enter PEN number"
              />
            </div>

          </div>
        </section>

        {/* ADDRESS */}
        <section className="admission-card">

          <div className="section-heading">
            <div className="section-icon">🏠</div>

            <div>
              <h2>Address & Previous School</h2>
              <p>Enter residential and previous academic details</p>
            </div>
          </div>

          <div className="form-field full-field">
            <label>Complete Address *</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete residential address"
              rows="4"
            />
          </div>

          <div className="form-field full-field">
            <label>Previous School</label>

            <input
              type="text"
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              placeholder="Enter previous school name"
            />
          </div>

        </section>

        {/* ACTIONS */}
        <div className="admission-actions">

          <button
            type="button"
            className="reset-admission-btn"
            onClick={resetForm}
          >
            ↻ Reset Form
          </button>

          <button
            type="submit"
            className="submit-admission-btn"
            disabled={saving}
          >
            {saving ? "Saving Admission..." : "🎓 Save New Admission"}
          </button>

        </div>

      </form>

      {/* SUCCESS */}
      {successStudent && (
        <div className="success-box">

          <div className="success-icon">✓</div>

          <div>
            <h3>Admission Saved Successfully</h3>

            <p>
              <strong>{successStudent.name}</strong> has been added to
              the Students database.
            </p>

            <div className="success-details">
              <span>
                Receipt: <strong>{successStudent.receiptNo}</strong>
              </span>

              <span>
                Class:{" "}
                <strong>
                  {successStudent.class}-{successStudent.section}
                </strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSuccessStudent(null)}
          >
            ✕
          </button>

        </div>
      )}

    </div>
  );
}

export default Admission;