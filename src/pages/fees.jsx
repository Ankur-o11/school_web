import { useState } from "react";

function Fees() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      fatherName: "Rajesh Sharma",
      className: "10-A",
      roll: "21",
      address: "Hingona, Rajasthan",
      totalFees: 45000,
      discount: 5000,
      payments: [
        {
          receiptNo: "MPSA-0001",
          amount: 10000,
          mode: "Cash",
          date: "14 Aug 2026",
          time: "10:30 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Aman Singh",
      fatherName: "Mahendra Singh",
      className: "10-A",
      roll: "22",
      address: "Jaipur, Rajasthan",
      totalFees: 45000,
      discount: 0,
      payments: [],
    },
    {
      id: 3,
      name: "Rohit Kumar",
      fatherName: "Suresh Kumar",
      className: "9-B",
      roll: "14",
      address: "Alwar, Rajasthan",
      totalFees: 40000,
      discount: 3000,
      payments: [
        {
          receiptNo: "MPSA-0002",
          amount: 15000,
          mode: "UPI",
          date: "12 Aug 2026",
          time: "11:15 AM",
        },
      ],
    },
    {
      id: 4,
      name: "Priya Singh",
      fatherName: "Rakesh Singh",
      className: "9-B",
      roll: "15",
      address: "Delhi",
      totalFees: 40000,
      discount: 0,
      payments: [
        {
          receiptNo: "MPSA-0003",
          amount: 40000,
          mode: "Bank Transfer",
          date: "10 Aug 2026",
          time: "02:20 PM",
        },
      ],
    },
  ]);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showPayment, setShowPayment] =
    useState(false);

  const [showHistory, setShowHistory] =
    useState(false);

  const [showReceipt, setShowReceipt] =
    useState(false);

  const [selectedReceipt, setSelectedReceipt] =
    useState(null);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [discount, setDiscount] =
    useState("");

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const getNetFees = (student) => {
    return student.totalFees - student.discount;
  };

  const getPaid = (student) => {
    return student.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
  };

  const getPending = (student) => {
    return getNetFees(student) - getPaid(student);
  };

  const totalFees = students.reduce(
    (sum, student) => sum + student.totalFees,
    0
  );

  const totalDiscount = students.reduce(
    (sum, student) => sum + student.discount,
    0
  );

  const totalPaid = students.reduce(
    (sum, student) => sum + getPaid(student),
    0
  );

  const totalPending =
    totalFees - totalDiscount - totalPaid;

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(value) ||
      student.fatherName.toLowerCase().includes(value) ||
      student.className.toLowerCase().includes(value) ||
      student.roll.includes(value)
    );
  });

  // ==========================================
  // OPEN PAYMENT
  // ==========================================

  const openPayment = (student) => {
    setSelectedStudent(student);
    setPaymentAmount("");
    setPaymentMode("Cash");
    setDiscount(student.discount);
    setShowPayment(true);
  };

  // ==========================================
  // SAVE PAYMENT
  // ==========================================

  const savePayment = (e) => {
    e.preventDefault();

    if (!paymentAmount) {
      alert("Please enter payment amount.");
      return;
    }

    const amount = Number(paymentAmount);

    const currentStudent = students.find(
      (student) => student.id === selectedStudent.id
    );

    const currentPending = getPending(currentStudent);

    if (amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    if (amount > currentPending) {
      alert(
        `Maximum pending amount is ₹${currentPending.toLocaleString()}`
      );
      return;
    }

    const now = new Date();

    const receiptNo =
      "MPSA-" +
      String(Date.now()).slice(-6);

    const newPayment = {
      receiptNo,
      amount,
      mode: paymentMode,
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedStudent = {
      ...currentStudent,
      discount: Number(discount) || 0,
      payments: [
        ...currentStudent.payments,
        newPayment,
      ],
    };

    const updatedStudents = students.map((student) =>
      student.id === currentStudent.id
        ? updatedStudent
        : student
    );

    setStudents(updatedStudents);

    setSelectedReceipt({
      student: updatedStudent,
      payment: newPayment,
    });

    setShowPayment(false);
    setShowReceipt(true);
  };

  // ==========================================
  // SHOW HISTORY
  // ==========================================

  const openHistory = (student) => {
    setSelectedStudent(student);
    setShowHistory(true);
  };

  // ==========================================
  // SHOW OLD RECEIPT
  // ==========================================

  const openOldReceipt = (student, payment) => {
    setSelectedReceipt({
      student,
      payment,
    });

    setShowHistory(false);
    setShowReceipt(true);
  };

  // ==========================================
  // PRINT
  // ==========================================

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="students-page">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="page-header">
        <div>
          <h1>Fees Management</h1>

          <p>
            Manage student fees, discounts,
            payments and receipts
          </p>
        </div>
      </div>

      {/* ================================= */}
      {/* STATISTICS */}
      {/* ================================= */}

      <div className="student-stats">

        <div className="student-stat-card">
          <span>💰</span>

          <div>
            <p>Total Fees</p>

            <h2>
              ₹{totalFees.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="student-stat-card">
          <span>🎁</span>

          <div>
            <p>Total Discount</p>

            <h2>
              ₹{totalDiscount.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="student-stat-card">
          <span>🟢</span>

          <div>
            <p>Total Collected</p>

            <h2>
              ₹{totalPaid.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="student-stat-card">
          <span>🔴</span>

          <div>
            <p>Total Pending</p>

            <h2>
              ₹{totalPending.toLocaleString()}
            </h2>
          </div>
        </div>

      </div>

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <div className="student-tools">

        <input
          type="text"
          placeholder="Search student, father name, class or roll..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="students-table">

        <div className="student-row table-heading">

          <span>Student</span>
          <span>Father</span>
          <span>Class</span>
          <span>Total</span>
          <span>Discount</span>
          <span>Paid</span>
          <span>Pending</span>
          <span>Action</span>

        </div>

        {filteredStudents.map((student) => {

          const netFees = getNetFees(student);
          const paid = getPaid(student);
          const pending = getPending(student);

          return (
            <div
              className="student-row"
              key={student.id}
            >

              <span>
                <strong>{student.name}</strong>
              </span>

              <span>
                {student.fatherName}
              </span>

              <span>
                {student.className}
              </span>

              <span>
                ₹{netFees.toLocaleString()}
              </span>

              <span>
                ₹{student.discount.toLocaleString()}
              </span>

              <span className="active">
                ₹{paid.toLocaleString()}
              </span>

              <span>
                ₹{pending.toLocaleString()}
              </span>

              <span className="fee-actions">

                <button
                  className="fee-pay-btn"
                  onClick={() =>
                    openPayment(student)
                  }
                >
                  + Pay
                </button>

                <button
                  className="history-btn"
                  onClick={() =>
                    openHistory(student)
                  }
                >
                  📋 History
                </button>

              </span>

            </div>
          );
        })}

      </div>

      {/* ================================= */}
      {/* PAYMENT MODAL */}
      {/* ================================= */}

      {showPayment && selectedStudent && (
        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>
                <h2>Fee Payment</h2>

                <p>
                  {selectedStudent.name}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowPayment(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="fee-student-info">

              <p>
                <strong>Father:</strong>{" "}
                {selectedStudent.fatherName}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {selectedStudent.className}
              </p>

              <p>
                <strong>Roll:</strong>{" "}
                {selectedStudent.roll}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {selectedStudent.address}
              </p>

            </div>

            <div className="fee-summary">

              <div>
                <span>Total Fees</span>

                <strong>
                  ₹{selectedStudent.totalFees.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Discount</span>

                <strong>
                  ₹{selectedStudent.discount.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Already Paid</span>

                <strong>
                  ₹{getPaid(selectedStudent).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Pending</span>

                <strong className="fee-pending">
                  ₹{getPending(selectedStudent).toLocaleString()}
                </strong>
              </div>

            </div>

            <form onSubmit={savePayment}>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Discount
                  </label>

                  <input
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(e.target.value)
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Payment Amount *
                  </label>

                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Payment Mode
                  </label>

                  <select
                    value={paymentMode}
                    onChange={(e) =>
                      setPaymentMode(
                        e.target.value
                      )
                    }
                  >

                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>

                  </select>

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowPayment(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  💾 Pay & Generate Receipt
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* PAYMENT HISTORY */}
      {/* ================================= */}

      {showHistory && selectedStudent && (
        <div className="modal-overlay">

          <div className="student-modal history-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Payment History
                </h2>

                <p>
                  {selectedStudent.name}
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowHistory(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="fee-student-info">

              <p>
                <strong>Father:</strong>{" "}
                {selectedStudent.fatherName}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {selectedStudent.className}
              </p>

              <p>
                <strong>Roll No:</strong>{" "}
                {selectedStudent.roll}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {selectedStudent.address}
              </p>

            </div>

            <div className="history-summary">

              <div>
                <span>Net Fees</span>
                <strong>
                  ₹{getNetFees(selectedStudent).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Total Paid</span>
                <strong>
                  ₹{getPaid(selectedStudent).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>
                  ₹{getPending(selectedStudent).toLocaleString()}
                </strong>
              </div>

            </div>

            {selectedStudent.payments.length === 0 ? (

              <div className="empty-history">
                <div>📋</div>

                <h3>
                  No Payment Yet
                </h3>

                <p>
                  This student has not
                  made any fee payment.
                </p>
              </div>

            ) : (

              <div className="history-table">

                <div className="history-row history-heading">

                  <span>Receipt No.</span>
                  <span>Date</span>
                  <span>Time</span>
                  <span>Amount</span>
                  <span>Mode</span>
                  <span>Action</span>

                </div>

                {selectedStudent.payments.map(
                  (payment, index) => (

                    <div
                      className="history-row"
                      key={
                        payment.receiptNo ||
                        index
                      }
                    >

                      <span>
                        <strong>
                          {payment.receiptNo}
                        </strong>
                      </span>

                      <span>
                        {payment.date}
                      </span>

                      <span>
                        {payment.time}
                      </span>

                      <span className="active">
                        ₹{payment.amount.toLocaleString()}
                      </span>

                      <span>
                        {payment.mode}
                      </span>

                      <span>

                        <button
                          className="view-receipt-btn"
                          onClick={() =>
                            openOldReceipt(
                              selectedStudent,
                              payment
                            )
                          }
                        >
                          🧾 View Receipt
                        </button>

                      </span>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* RECEIPT */}
      {/* ================================= */}

      {showReceipt && selectedReceipt && (
        <div className="modal-overlay">

          <div className="receipt">

            <div className="receipt-header">

              <h1>
                MPSA SCHOOL
              </h1>

              <p>
                Maharana Pratap Science Academy
              </p>

              <h2>
                FEE PAYMENT RECEIPT
              </h2>

            </div>

            <div className="receipt-line" />

            <div className="receipt-info">

              <p>
                <strong>Receipt No:</strong>{" "}
                {selectedReceipt.payment.receiptNo}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {selectedReceipt.payment.date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {selectedReceipt.payment.time}
              </p>

            </div>

            <div className="receipt-line" />

            <div className="receipt-info">

              <p>
                <strong>Student:</strong>{" "}
                {selectedReceipt.student.name}
              </p>

              <p>
                <strong>Father's Name:</strong>{" "}
                {selectedReceipt.student.fatherName}
              </p>

              <p>
                <strong>Class:</strong>{" "}
                {selectedReceipt.student.className}
              </p>

              <p>
                <strong>Roll No:</strong>{" "}
                {selectedReceipt.student.roll}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {selectedReceipt.student.address}
              </p>

            </div>

            <div className="receipt-line" />

            <div className="receipt-fees">

              <p>
                Total Fees:
                <strong>
                  ₹{selectedReceipt.student.totalFees.toLocaleString()}
                </strong>
              </p>

              <p>
                Discount:
                <strong>
                  ₹{selectedReceipt.student.discount.toLocaleString()}
                </strong>
              </p>

              <p>
                Net Fees:
                <strong>
                  ₹{getNetFees(selectedReceipt.student).toLocaleString()}
                </strong>
              </p>

              <p>
                Current Payment:
                <strong>
                  ₹{selectedReceipt.payment.amount.toLocaleString()}
                </strong>
              </p>

              <p>
                Payment Mode:
                <strong>
                  {selectedReceipt.payment.mode}
                </strong>
              </p>

            </div>

            <div className="receipt-total">

              <span>
                Total Paid
              </span>

              <strong>
                ₹{getPaid(selectedReceipt.student).toLocaleString()}
              </strong>

            </div>

            <div className="receipt-total">

              <span>
                Remaining
              </span>

              <strong>
                ₹{getPending(selectedReceipt.student).toLocaleString()}
              </strong>

            </div>

            <div className="receipt-footer">

              <p>
                Thank you for your payment.
              </p>

              <p>
                This is a computer-generated receipt.
              </p>

            </div>

            <div className="form-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowReceipt(false)
                }
              >
                Close
              </button>

              <button
                className="save-btn"
                onClick={printReceipt}
              >
                🖨️ Print Receipt
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Fees;