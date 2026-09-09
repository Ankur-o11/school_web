import { useEffect, useState } from "react";
import "../Style/fees.css";
import { useAuth } from "../context/AuthContext";

function Fees() {
  const { fetchWithAuth } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [totalFeesInput, setTotalFeesInput] = useState("");
  const [discount, setDiscount] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    totalDiscount: 0,
    totalCollected: 0,
    totalPending: 0,
  });

  // =====================================================
  // HELPERS
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const getNetFees = (student) => {
    return Math.max(
      Number(student.totalFees || 0) -
        Number(student.discount || 0),
      0
    );
  };

  const getPaid = (student) => {
    return (student.payments || []).reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );
  };

  const getPending = (student) => {
    return Math.max(
      getNetFees(student) - getPaid(student),
      0
    );
  };

  // =====================================================
  // LOAD FEES
  // =====================================================

  const loadFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth("/fees");

      if (!response.ok) {
        throw new Error(
          `Failed to load fees (${response.status})`
        );
      }

      const data = await response.json();

      const feeStudents =
        data.students ||
        data.fees ||
        data.data ||
        [];

      setStudents(
        Array.isArray(feeStudents)
          ? feeStudents
          : []
      );
    } catch (err) {
      console.error(
        "Fees loading error:",
        err
      );

      setError(
        "Unable to load fees from server. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD STATS
  // =====================================================

  const loadStats = async () => {
    try {
      const response = await fetchWithAuth("/fees/stats");

      if (!response.ok) {
        throw new Error(
          `Failed to load stats (${response.status})`
        );
      }

      const data = await response.json();

      const statsData =
        data.stats || data.data || data;

      setStats({
        totalStudents:
          Number(
            statsData.totalStudents || 0
          ),

        totalFees:
          Number(
            statsData.totalFees || 0
          ),

        totalDiscount:
          Number(
            statsData.totalDiscount || 0
          ),

        totalCollected:
          Number(
            statsData.totalCollected || 0
          ),

        totalPending:
          Number(
            statsData.totalPending || 0
          ),
      });
    } catch (err) {
      console.error(
        "Fee stats error:",
        err
      );
    }
  };

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================

  const refreshFees = async () => {
    await Promise.all([
      loadFees(),
      loadStats(),
    ]);
  };

  useEffect(() => {
    refreshFees();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents =
    students.filter((student) => {
      const value =
        search.trim().toLowerCase();

      if (!value) return true;

      return (
        String(
          student.name || ""
        )
          .toLowerCase()
          .includes(value) ||

        String(
          student.fatherName ||
            student.father ||
            ""
        )
          .toLowerCase()
          .includes(value) ||

        String(
          student.className ||
            student.class ||
            ""
        )
          .toLowerCase()
          .includes(value) ||

        String(
          student.section || ""
        )
          .toLowerCase()
          .includes(value) ||

        String(
          student.roll ||
            student.rollNo ||
            ""
        )
          .toLowerCase()
          .includes(value)
      );
    });

  // =====================================================
  // OPEN PAYMENT / FEE STRUCTURE
  // =====================================================

  const openPayment = (student) => {
    setSelectedStudent(student);

    setTotalFeesInput(
      String(student.totalFees || 0)
    );

    setDiscount(
      String(student.discount || 0)
    );

    setPaymentAmount("");
    setPaymentMode("Cash");

    setShowPayment(true);
    setShowHistory(false);
    setShowReceipt(false);
  };

  // =====================================================
  // CLOSE PAYMENT
  // =====================================================

  const closePayment = () => {
    if (saving) return;

    setShowPayment(false);
    setSelectedStudent(null);
    setPaymentAmount("");
    setTotalFeesInput("");
    setDiscount("");
  };

  // =====================================================
  // SAVE FEE STRUCTURE
  // =====================================================

  const saveFeeStructure = async () => {
    if (!selectedStudent) return;

    const totalFees =
      Number(totalFeesInput);

    const discountAmount =
      Number(discount);

    if (
      Number.isNaN(totalFees) ||
      totalFees < 0
    ) {
      alert(
        "Please enter a valid total fee."
      );
      return;
    }

    if (
      Number.isNaN(discountAmount) ||
      discountAmount < 0
    ) {
      alert(
        "Please enter a valid discount."
      );
      return;
    }

    if (discountAmount > totalFees) {
      alert(
        "Discount cannot be greater than total fees."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetchWithAuth(
        `/fees/student/${selectedStudent.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            totalFees,
            discount:
              discountAmount,
            academicYear:
              selectedStudent.academicYear,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to update fee structure."
        );
      }

      alert(
        "Fee structure updated successfully."
      );

      await refreshFees();

      const updatedStudentsRes = await fetchWithAuth("/fees");
      const updatedStudents = await updatedStudentsRes.json();

      const list =
        updatedStudents.students ||
        updatedStudents.fees ||
        [];

      const updatedStudent =
        Array.isArray(list)
          ? list.find(
              (item) =>
                item.id ===
                selectedStudent.id
            )
          : null;

      if (updatedStudent) {
        setSelectedStudent(
          updatedStudent
        );

        setTotalFeesInput(
          String(
            updatedStudent.totalFees || 0
          )
        );

        setDiscount(
          String(
            updatedStudent.discount || 0
          )
        );
      }
    } catch (err) {
      console.error(
        "Fee structure error:",
        err
      );

      alert(
        err.message ||
          "Unable to update fee structure."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SAVE PAYMENT
  // =====================================================

  const savePayment = async (event) => {
    event.preventDefault();

    if (!selectedStudent) return;

    const amount =
      Number(paymentAmount);

    const totalFees =
      Number(totalFeesInput);

    const discountAmount =
      Number(discount);

    if (
      !Number.isFinite(totalFees) ||
      totalFees < 0
    ) {
      alert(
        "Please set a valid total fee first."
      );
      return;
    }

    if (
      !Number.isFinite(discountAmount) ||
      discountAmount < 0
    ) {
      alert(
        "Please enter a valid discount."
      );
      return;
    }

    if (discountAmount > totalFees) {
      alert(
        "Discount cannot be greater than total fees."
      );
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      alert(
        "Please enter a valid payment amount."
      );
      return;
    }

    const currentPending =
      Math.max(
        totalFees -
          discountAmount -
          getPaid(selectedStudent),
        0
      );

    if (currentPending <= 0) {
      alert(
        "There is no pending fee for this student."
      );
      return;
    }

    if (amount > currentPending) {
      alert(
        `Maximum pending amount is ₹${formatMoney(
          currentPending
        )}`
      );
      return;
    }

    try {
      setSaving(true);

      // -------------------------------------------------
      // First update fee structure
      // -------------------------------------------------

      const feeResponse = await fetchWithAuth(
        `/fees/student/${selectedStudent.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            totalFees,
            discount: discountAmount,
            academicYear: selectedStudent.academicYear,
          }),
        }
      );

      const feeData =
        await feeResponse.json();

      if (!feeResponse.ok) {
        throw new Error(
          feeData.message ||
            feeData.error ||
            "Unable to save fee structure."
        );
      }

      // -------------------------------------------------
      // Then make payment
      // -------------------------------------------------

      const paymentResponse = await fetchWithAuth(
        `/fees/student/${selectedStudent.id}/payment`,
        {
          method: "POST",
          body: JSON.stringify({
            amount,
            mode: paymentMode,
            academicYear: selectedStudent.academicYear,
          }),
        }
      );

      const paymentData =
        await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            paymentData.error ||
            "Unable to save payment."
        );
      }

      // Backend may return payment in:
      // payment / data / result

      const payment =
        paymentData.payment ||
        paymentData.data ||
        paymentData.result;

      await refreshFees();

      // -------------------------------------------------
      // Create receipt
      // -------------------------------------------------

      let latestStudent =
        selectedStudent;

      try {
        const refreshed = await fetchWithAuth("/fees");

        const refreshedData =
          await refreshed.json();

        const refreshedStudents =
          refreshedData.students ||
          refreshedData.fees ||
          [];

        const found =
          Array.isArray(
            refreshedStudents
          )
            ? refreshedStudents.find(
                (item) =>
                  item.id ===
                  selectedStudent.id
              )
            : null;

        if (found) {
          latestStudent = found;
        }
      } catch (refreshError) {
        console.error(
          refreshError
        );
      }

      const receiptPayment =
        payment ||
        latestStudent.payments?.[
          latestStudent.payments.length - 1
        ];

      setSelectedReceipt({
        student: latestStudent,
        payment: receiptPayment,
      });

      setShowPayment(false);
      setShowReceipt(true);

      setPaymentAmount("");
    } catch (err) {
      console.error(
        "Payment error:",
        err
      );

      alert(
        err.message ||
          "Unable to save payment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // HISTORY
  // =====================================================

  const openHistory = (student) => {
    setSelectedStudent(student);

    setShowHistory(true);
    setShowPayment(false);
    setShowReceipt(false);
  };

  // =====================================================
  // OLD RECEIPT
  // =====================================================

  const openOldReceipt = (
    student,
    payment
  ) => {
    setSelectedReceipt({
      student,
      payment,
    });

    setShowHistory(false);
    setShowReceipt(true);
  };

  // =====================================================
  // PRINT RECEIPT
  // =====================================================

  const printReceipt = () => {
    window.print();
  };

  // =====================================================
  // CLOSE HISTORY
  // =====================================================

  const closeHistory = () => {
    setShowHistory(false);
    setSelectedStudent(null);
  };

  // =====================================================
  // CLOSE RECEIPT
  // =====================================================

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedReceipt(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="students-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="page-header">

        <div>
          <h1>
            Fees Management
          </h1>

          <p>
            Manage student fees,
            discounts, payments and
            receipts
          </p>
        </div>

      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "15px",
            background:
              "#fee2e2",
            color:
              "#991b1b",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="student-stats">

        <div className="student-stat-card">

          <span>💰</span>

          <div>
            <p>Total Fees</p>

            <h2>
              ₹
              {formatMoney(
                stats.totalFees
              )}
            </h2>
          </div>

        </div>

        <div className="student-stat-card">

          <span>🎁</span>

          <div>
            <p>Total Discount</p>

            <h2>
              ₹
              {formatMoney(
                stats.totalDiscount
              )}
            </h2>
          </div>

        </div>

        <div className="student-stat-card">

          <span>🟢</span>

          <div>
            <p>Total Collected</p>

            <h2>
              ₹
              {formatMoney(
                stats.totalCollected
              )}
            </h2>
          </div>

        </div>

        <div className="student-stat-card">

          <span>🔴</span>

          <div>
            <p>Total Pending</p>

            <h2>
              ₹
              {formatMoney(
                stats.totalPending
              )}
            </h2>
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="student-tools">

        <input
          type="text"
          placeholder="Search student, father name, class, section or roll..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading fees...
        </div>

      ) : (

        <div className="students-table">

          {/* TABLE HEADER */}

          <div className="student-row table-heading">

            <span>
              Student
            </span>

            <span>
              Father
            </span>

            <span>
              Class
            </span>

            <span>
              Total
            </span>

            <span>
              Discount
            </span>

            <span>
              Paid
            </span>

            <span>
              Pending
            </span>

            <span>
              Action
            </span>

          </div>

          {/* STUDENTS */}

          {filteredStudents.length === 0 ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              No students found.
            </div>

          ) : (

            filteredStudents.map(
              (student) => {

                const netFees =
                  getNetFees(
                    student
                  );

                const paid =
                  getPaid(
                    student
                  );

                const pending =
                  getPending(
                    student
                  );

                return (
                  <div
                    className="student-row"
                    key={
                      student.id
                    }
                  >

                    <span>
                      <strong>
                        {
                          student.name ||
                          student.studentName ||
                          "-"
                        }
                      </strong>
                    </span>

                    <span>
                      {
                        student.fatherName ||
                        student.father ||
                        "-"
                      }
                    </span>

                    <span>
                      {
                        student.className ||
                        student.class ||
                        "-"
                      }
                      {student.section
                        ? `-${student.section}`
                        : ""}
                    </span>

                    <span>
                      ₹
                      {formatMoney(
                        netFees
                      )}
                    </span>

                    <span>
                      ₹
                      {formatMoney(
                        student.discount
                      )}
                    </span>

                    <span className="active">
                      ₹
                      {formatMoney(
                        paid
                      )}
                    </span>

                    <span>
                      ₹
                      {formatMoney(
                        pending
                      )}
                    </span>

                    <span className="fee-actions">

                      <button
                        className="fee-pay-btn"
                        onClick={() =>
                          openPayment(
                            student
                          )
                        }
                      >
                        + Pay
                      </button>

                      <button
                        className="history-btn"
                        onClick={() =>
                          openHistory(
                            student
                          )
                        }
                      >
                        📋 History
                      </button>

                    </span>

                  </div>
                );
              }
            )

          )}

        </div>

      )}

      {/* ================================================= */}
      {/* PAYMENT + FEE STRUCTURE MODAL */}
      {/* ================================================= */}

      {showPayment &&
        selectedStudent && (

          <div className="modal-overlay">

            <div className="student-modal">

              <div className="modal-header">

                <div>

                  <h2>
                    Fee Management
                  </h2>

                  <p>
                    {
                      selectedStudent.name
                    }
                  </p>

                </div>

                <button
                  className="close-btn"
                  onClick={
                    closePayment
                  }
                >
                  ✕
                </button>

              </div>

              {/* STUDENT INFO */}

              <div className="fee-student-info">

                <p>
                  <strong>
                    Father:
                  </strong>{" "}
                  {
                    selectedStudent.fatherName ||
                    selectedStudent.father ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Class:
                  </strong>{" "}
                  {
                    selectedStudent.className ||
                    selectedStudent.class ||
                    "-"
                  }
                  {selectedStudent.section
                    ? `-${selectedStudent.section}`
                    : ""}
                </p>

                <p>
                  <strong>
                    Roll:
                  </strong>{" "}
                  {
                    selectedStudent.roll ||
                    selectedStudent.rollNo ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {
                    selectedStudent.address ||
                    "-"
                  }
                </p>

              </div>

              {/* FEE SUMMARY */}

              <div className="fee-summary">

                <div>

                  <span>
                    Total Fees
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      totalFeesInput
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Discount
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      discount
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Already Paid
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      getPaid(
                        selectedStudent
                      )
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Pending
                  </span>

                  <strong className="fee-pending">
                    ₹
                    {formatMoney(
                      Math.max(
                        Number(
                          totalFeesInput ||
                            0
                        ) -
                          Number(
                            discount ||
                              0
                          ) -
                          getPaid(
                            selectedStudent
                          ),
                        0
                      )
                    )}
                  </strong>

                </div>

              </div>

              {/* FEE STRUCTURE */}

              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  padding: "18px",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                }}
              >

                <h3
                  style={{
                    marginTop: 0,
                  }}
                >
                  Fee Structure
                </h3>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Total Fees *
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        totalFeesInput
                      }
                      onChange={(event) =>
                        setTotalFeesInput(
                          event.target
                            .value
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Discount
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(event) =>
                        setDiscount(
                          event.target
                            .value
                        )
                      }
                    />

                  </div>

                </div>

                <button
                  type="button"
                  className="save-btn"
                  disabled={saving}
                  onClick={
                    saveFeeStructure
                  }
                >
                  💾 Save Fee Structure
                </button>

              </div>

              {/* PAYMENT */}

              <form
                onSubmit={
                  savePayment
                }
              >

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Payment Amount *
                    </label>

                    <input
                      type="number"
                      min="1"
                      placeholder="Enter payment amount"
                      value={
                        paymentAmount
                      }
                      onChange={(event) =>
                        setPaymentAmount(
                          event.target
                            .value
                        )
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Payment Mode
                    </label>

                    <select
                      value={
                        paymentMode
                      }
                      onChange={(event) =>
                        setPaymentMode(
                          event.target
                            .value
                        )
                      }
                    >

                      <option value="Cash">
                        Cash
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>

                      <option value="Cheque">
                        Cheque
                      </option>

                    </select>

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    disabled={saving}
                    onClick={
                      closePayment
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "💳 Pay & Generate Receipt"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      {/* ================================================= */}
      {/* PAYMENT HISTORY */}
      {/* ================================================= */}

      {showHistory &&
        selectedStudent && (

          <div className="modal-overlay">

            <div className="student-modal history-modal">

              <div className="modal-header">

                <div>

                  <h2>
                    Payment History
                  </h2>

                  <p>
                    {
                      selectedStudent.name
                    }
                  </p>

                </div>

                <button
                  className="close-btn"
                  onClick={
                    closeHistory
                  }
                >
                  ✕
                </button>

              </div>

              <div className="fee-student-info">

                <p>
                  <strong>
                    Father:
                  </strong>{" "}
                  {
                    selectedStudent.fatherName ||
                    selectedStudent.father ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Class:
                  </strong>{" "}
                  {
                    selectedStudent.className ||
                    selectedStudent.class ||
                    "-"
                  }
                  {selectedStudent.section
                    ? `-${selectedStudent.section}`
                    : ""}
                </p>

                <p>
                  <strong>
                    Roll No:
                  </strong>{" "}
                  {
                    selectedStudent.roll ||
                    selectedStudent.rollNo ||
                    "-"
                  }
                </p>

              </div>

              <div className="history-summary">

                <div>

                  <span>
                    Net Fees
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      getNetFees(
                        selectedStudent
                      )
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Total Paid
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      getPaid(
                        selectedStudent
                      )
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Pending
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      getPending(
                        selectedStudent
                      )
                    )}
                  </strong>

                </div>

              </div>

              {!selectedStudent.payments ||
              selectedStudent.payments.length ===
                0 ? (

                <div className="empty-history">

                  <div>
                    📋
                  </div>

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

                    <span>
                      Receipt No.
                    </span>

                    <span>
                      Date
                    </span>

                    <span>
                      Amount
                    </span>

                    <span>
                      Mode
                    </span>

                    <span>
                      Action
                    </span>

                  </div>

                  {selectedStudent.payments
                    .map(
                      (
                        payment,
                        index
                      ) => (

                        <div
                          className="history-row"
                          key={
                            payment.paymentId ||
                            payment.receiptNo ||
                            index
                          }
                        >

                          <span>
                            <strong>
                              {
                                payment.receiptNo ||
                                "-"
                              }
                            </strong>
                          </span>

                          <span>
                            {payment.date
                              ? new Date(
                                  payment.date
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : "-"}
                          </span>

                          <span className="active">
                            ₹
                            {formatMoney(
                              payment.amount
                            )}
                          </span>

                          <span>
                            {
                              payment.mode ||
                              "Cash"
                            }
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

      {/* ================================================= */}
      {/* RECEIPT */}
      {/* ================================================= */}

      {showReceipt &&
        selectedReceipt &&
        selectedReceipt.payment && (

          <div className="modal-overlay">

            <div className="receipt">

              <div className="receipt-header">

                <h1>
                  MPSA SCHOOL
                </h1>

                <p>
                  Maharana Pratap Science
                  Academy
                </p>

                <h2>
                  FEE PAYMENT RECEIPT
                </h2>

              </div>

              <div className="receipt-line" />

              <div className="receipt-info">

                <p>
                  <strong>
                    Receipt No:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .payment
                      .receiptNo ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {selectedReceipt
                    .payment
                    .date
                    ? new Date(
                        selectedReceipt
                          .payment
                          .date
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"}
                </p>

              </div>

              <div className="receipt-line" />

              <div className="receipt-info">

                <p>
                  <strong>
                    Student:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .student
                      .name
                  }
                </p>

                <p>
                  <strong>
                    Father's Name:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .student
                      .fatherName ||
                    selectedReceipt
                      .student
                      .father ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Class:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .student
                      .className ||
                    selectedReceipt
                      .student
                      .class ||
                    "-"
                  }
                  {selectedReceipt
                    .student
                    .section
                    ? `-${selectedReceipt.student.section}`
                    : ""}
                </p>

                <p>
                  <strong>
                    Roll No:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .student
                      .roll ||
                    selectedReceipt
                      .student
                      .rollNo ||
                    "-"
                  }
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {
                    selectedReceipt
                      .student
                      .address ||
                    "-"
                  }
                </p>

              </div>

              <div className="receipt-line" />

              <div className="receipt-fees">

                <p>
                  Total Fees:

                  <strong>
                    ₹
                    {formatMoney(
                      selectedReceipt
                        .student
                        .totalFees
                    )}
                  </strong>
                </p>

                <p>
                  Discount:

                  <strong>
                    ₹
                    {formatMoney(
                      selectedReceipt
                        .student
                        .discount
                    )}
                  </strong>
                </p>

                <p>
                  Net Fees:

                  <strong>
                    ₹
                    {formatMoney(
                      getNetFees(
                        selectedReceipt
                          .student
                      )
                    )}
                  </strong>
                </p>

                <p>
                  Current Payment:

                  <strong>
                    ₹
                    {formatMoney(
                      selectedReceipt
                        .payment
                        .amount
                    )}
                  </strong>
                </p>

                <p>
                  Payment Mode:

                  <strong>
                    {
                      selectedReceipt
                        .payment
                        .mode ||
                      "Cash"
                    }
                  </strong>
                </p>

              </div>

              <div className="receipt-total">

                <span>
                  Total Paid
                </span>

                <strong>
                  ₹
                  {formatMoney(
                    getPaid(
                      selectedReceipt
                        .student
                    )
                  )}
                </strong>

              </div>

              <div className="receipt-total">

                <span>
                  Remaining
                </span>

                <strong>
                  ₹
                  {formatMoney(
                    getPending(
                      selectedReceipt
                        .student
                    )
                  )}
                </strong>

              </div>

              <div className="receipt-footer">

                <p>
                  Thank you for your
                  payment.
                </p>

                <p>
                  This is a
                  computer-generated
                  receipt.
                </p>

              </div>

              <div className="form-actions">

                <button
                  className="cancel-btn"
                  onClick={
                    closeReceipt
                  }
                >
                  Close
                </button>

                <button
                  className="save-btn"
                  onClick={
                    printReceipt
                  }
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