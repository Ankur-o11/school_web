import { useEffect, useState } from "react";
import "../Style/teacher-salary.css";
import { useAuth } from "../context/AuthContext";

function TeacherSalary() {
  const { fetchWithAuth } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [workingDays, setWorkingDays] = useState(26);
  const [manualAdjustment, setManualAdjustment] = useState(0);

  const [salary, setSalary] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Salary");
  const [paymentNote, setPaymentNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchTeachers();
    fetchSalaryRecords();
  }, []);

  // =====================================================
  // FETCH TEACHERS
  // =====================================================

  const fetchTeachers = async () => {
    try {
      const response = await fetchWithAuth("/teachers");

      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }

      const data = await response.json();

      setTeachers(data);

      if (data.length > 0) {
        setSelectedTeacher(String(data[0].id));
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH SALARY RECORDS
  // =====================================================

  const fetchSalaryRecords = async () => {
    try {
      const response = await fetchWithAuth("/teacher-salary");

      if (!response.ok) {
        throw new Error("Failed to fetch salaries");
      }

      const data = await response.json();

      setSalaryRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // CALCULATE SALARY
  // =====================================================

  const calculateSalary = async () => {
    if (!selectedTeacher) {
      alert("Please select a teacher.");
      return;
    }

    setCalculating(true);

    try {
      const response = await fetchWithAuth(
        `/teacher-salary/calculate?teacherId=${selectedTeacher}&month=${selectedMonth}&workingDays=${workingDays}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const adjustment = Number(manualAdjustment) || 0;

      setSalary({
        ...data,
        manualAdjustment: adjustment,
        finalSalary:
          Number(data.finalSalary || 0) + adjustment,
      });

      // Payment amount automatically salary ke equal
      setPaymentAmount(
        Number(data.finalSalary || 0) + adjustment
      );
    } catch (error) {
      console.error(error);
      alert("Unable to calculate salary.");
    } finally {
      setCalculating(false);
    }
  };

  // =====================================================
  // SAVE SALARY
  // =====================================================

  const saveSalary = async () => {
    if (!salary) {
      alert("Please calculate salary first.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetchWithAuth("/teacher-salary", {
        method: "POST",
          body: JSON.stringify({
            teacherId: Number(selectedTeacher),
            month: selectedMonth,
            workingDays: Number(workingDays),
            manualAdjustment:
              Number(manualAdjustment) || 0,
            paid: false,
            note: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Salary record saved successfully!");

      setSalaryRecords((previous) => [
        ...previous,
        data.salary,
      ]);

      setSalary(data.salary);
    } catch (error) {
      console.error(error);
      alert("Unable to save salary.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PAY SALARY / ADVANCE
  // =====================================================

  const paySalary = async () => {
    if (!salary) {
      alert("Please calculate salary first.");
      return;
    }

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (amount > Number(salary.finalSalary)) {
      alert("Payment cannot be greater than remaining salary.");
      return;
    }

    setPaying(true);

    try {
      const response = await fetchWithAuth(`/teacher-salary/${salary.id}/payment`, {
        method: "POST",
          body: JSON.stringify({
            amount,
            type: paymentType,
            note: paymentNote,
            date: new Date().toISOString().slice(0, 10),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Payment recorded successfully!");

      setSalary(data.salary);

      setPaymentAmount("");
      setPaymentNote("");

      fetchSalaryRecords();
    } catch (error) {
      console.error(error);
      alert(
        error.message || "Unable to record payment."
      );
    } finally {
      setPaying(false);
    }
  };

  // =====================================================
  // DELETE SALARY
  // =====================================================

  const deleteSalary = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchWithAuth(`/teacher-salary/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSalaryRecords((previous) =>
        previous.filter(
          (record) => record.id !== id
        )
      );

      alert("Salary record deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to delete salary record.");
    }
  };

  // =====================================================
  // TEACHER NAME
  // =====================================================

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(
      (item) => item.id === Number(teacherId)
    );

    return teacher?.name || "Unknown Teacher";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teacher-salary-page">

      {/* HEADER */}

      <div className="teacher-salary-header">
        <div>
          <h1>Teacher Salary</h1>

          <p>
            Calculate, manage and track teacher salary
            payments
          </p>
        </div>
      </div>

      {/* CALCULATOR */}

      <div className="salary-calculator">

        <div className="salary-section-title">
          <div>
            <h2>Salary Calculator</h2>

            <p>
              Calculate salary based on attendance
            </p>
          </div>
        </div>

        <div className="salary-form-grid">

          {/* TEACHER */}

          <div className="salary-form-group">
            <label>Teacher</label>

            <select
              value={selectedTeacher}
              onChange={(e) =>
                setSelectedTeacher(e.target.value)
              }
            >
              <option value="">
                Select Teacher
              </option>

              {teachers.map((teacher) => (
                <option
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.name} - {teacher.employeeId}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH */}

          <div className="salary-form-group">
            <label>Salary Month</label>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value)
              }
            />
          </div>

          {/* WORKING DAYS */}

          <div className="salary-form-group">
            <label>Working Days</label>

            <input
              type="number"
              min="1"
              max="31"
              value={workingDays}
              onChange={(e) =>
                setWorkingDays(e.target.value)
              }
            />
          </div>

          {/* ADJUSTMENT */}

          <div className="salary-form-group">
            <label>Manual Adjustment</label>

            <input
              type="number"
              value={manualAdjustment}
              onChange={(e) =>
                setManualAdjustment(e.target.value)
              }
              placeholder="0"
            />
          </div>

        </div>

        <button
          type="button"
          className="calculate-salary-btn"
          onClick={calculateSalary}
          disabled={calculating}
        >
          {calculating
            ? "Calculating..."
            : "🧮 Calculate Salary"}
        </button>
      </div>

      {/* SALARY RESULT */}

      {salary && (
        <div className="salary-result">

          <div className="salary-result-header">

            <div>
              <h2>Salary Summary</h2>

              <p>
                {getTeacherName(salary.teacherId)} •{" "}
                {salary.month}
              </p>
            </div>

            <div className="final-salary">
              ₹
              {Number(
                salary.finalSalary || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>

          <div className="salary-summary-grid">

            <div>
              <span>Monthly Salary</span>

              <strong>
                ₹
                {Number(
                  salary.finalSalary || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Working Days</span>

              <strong>
                {salary.workingDays}
              </strong>
            </div>

            <div>
              <span>Absent Days</span>

              <strong>
                {salary.absentDays}
              </strong>
            </div>

            <div>
              <span>Paid Leave</span>

              <strong>
                {salary.paidLeaveDays}
              </strong>
            </div>

            <div>
              <span>Unpaid Leave</span>

              <strong>
                {salary.unpaidLeaveDays}
              </strong>
            </div>

            <div>
              <span>Leave Deduction</span>

              <strong className="deduction">
                ₹
                {Number(
                  salary.leaveDeduction || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Adjustment</span>

              <strong>
                ₹
                {Number(
                  salary.manualAdjustment || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Per Day Salary</span>

              <strong>
                ₹
                {Number(
                  salary.perDaySalary || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            {/* PAID */}

            <div className="paid-box">
              <span>Total Paid</span>

              <strong>
                ₹
                {Number(
                  salary.totalPaid || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            {/* REMAINING */}

            <div className="remaining-box">
              <span>Remaining</span>

              <strong>
                ₹
                {Number(
                  salary.remainingSalary ??
                    salary.finalSalary ??
                    0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

          {/* SAVE */}

          {!salary.id && (
            <button
              type="button"
              className="save-salary-btn"
              onClick={saveSalary}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "💾 Save Salary Record"}
            </button>
          )}

          {/* PAYMENT */}

          {salary.id && (
            <div className="salary-payment-box">

              <div className="payment-title">
                <div>
                  <h3>💰 Salary Payment</h3>

                  <p>
                    Record salary or advance payment
                  </p>
                </div>
              </div>

              <div className="payment-grid">

                <div className="salary-form-group">
                  <label>Payment Type</label>

                  <select
                    value={paymentType}
                    onChange={(e) =>
                      setPaymentType(
                        e.target.value
                      )
                    }
                  >
                    <option value="Salary">
                      Salary Payment
                    </option>

                    <option value="Advance">
                      Advance Payment
                    </option>
                  </select>
                </div>

                <div className="salary-form-group">
                  <label>Payment Amount</label>

                  <input
                    type="number"
                    min="1"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(
                        e.target.value
                      )
                    }
                    placeholder="Enter amount"
                  />
                </div>

                <div className="salary-form-group">
                  <label>Payment Note</label>

                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) =>
                      setPaymentNote(
                        e.target.value
                      )
                    }
                    placeholder="Example: Salary paid"
                  />
                </div>

              </div>

              <button
                type="button"
                className="pay-salary-btn"
                onClick={paySalary}
                disabled={paying}
              >
                {paying
                  ? "Saving Payment..."
                  : "💵 Record Payment"}
              </button>

            </div>
          )}

        </div>
      )}

      {/* SALARY HISTORY */}

      <div className="salary-history">

        <div className="salary-history-header">
          <div>
            <h2>Salary History</h2>

            <p>
              Previously generated salary records
            </p>
          </div>
        </div>

        {loading ? (
          <div className="salary-empty">
            Loading...
          </div>
        ) : salaryRecords.length === 0 ? (
          <div className="salary-empty">
            <h3>No Salary Records</h3>

            <p>
              Calculate and save a salary record
              to see it here.
            </p>
          </div>
        ) : (
          <div className="salary-table">

            <div className="salary-row salary-heading">
              <span>Teacher</span>
              <span>Month</span>
              <span>Salary</span>
              <span>Paid</span>
              <span>Remaining</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {salaryRecords.map((record) => (
              <div
                className="salary-row"
                key={record.id}
              >

                <span>
                  <strong>
                    {getTeacherName(
                      record.teacherId
                    )}
                  </strong>
                </span>

                <span>
                  {record.month}
                </span>

                <span>
                  ₹
                  {Number(
                    record.finalSalary || 0
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  ₹
                  {Number(
                    record.totalPaid || 0
                  ).toLocaleString("en-IN")}
                </span>

                <span className="salary-amount">
                  ₹
                  {Number(
                    record.remainingSalary ??
                      record.finalSalary ??
                      0
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  <span
                    className={
                      Number(
                        record.remainingSalary ??
                          record.finalSalary ??
                          0
                      ) <= 0
                        ? "paid-badge"
                        : "unpaid-badge"
                    }
                  >
                    {Number(
                      record.remainingSalary ??
                        record.finalSalary ??
                        0
                    ) <= 0
                      ? "Paid"
                      : "Pending"}
                  </span>
                </span>

                <span>
                  <button
                    type="button"
                    className="delete-salary-btn"
                    onClick={() =>
                      deleteSalary(record.id)
                    }
                  >
                    🗑️
                  </button>
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default TeacherSalary;