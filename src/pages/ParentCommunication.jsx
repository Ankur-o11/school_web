import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import WhatsAppModal from "../components/WhatsAppModal";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import { isValidWhatsAppNumber, normalizePhoneNumber } from "../services/whatsappService";
import "../Style/ui.css";

export function ParentCommunication() {
  const { fetchWithAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("single");

  // Single Student State
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchClass, setSearchClass] = useState("All");
  const [searchSection, setSearchSection] = useState("All");
  const [selectedStudentForWhatsApp, setSelectedStudentForWhatsApp] = useState(null);

  // Broadcast Wizard State
  const [targetType, setTargetType] = useState("class");
  const [targetClass, setTargetClass] = useState("All");
  const [targetSection, setTargetSection] = useState("All");
  const [messageType, setMessageType] = useState("Fee Details");
  const [customNoticeText, setCustomNoticeText] = useState("");

  const [loading, setLoading] = useState(false);
  const [compiledResult, setCompiledResult] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Sequential Workflow State
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Templates & Logs
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setStudentsLoading(true);
      const [tplRes, logRes, studRes] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/communications/templates`),
        fetchWithAuth(`${API_BASE_URL}/communications/logs`),
        fetchWithAuth(`${API_BASE_URL}/students`)
      ]);
      const tplData = await tplRes.json();
      const logData = await logRes.json();
      const studData = await studRes.json();

      if (tplData.success) setTemplates(tplData.data || []);
      if (logData.success) setLogs(logData.data || []);
      
      if (Array.isArray(studData)) {
        setStudents(studData);
      } else if (studData.success && Array.isArray(studData.data)) {
        setStudents(studData.data);
      }
    } catch (err) {
      console.error("Fetch communications data error:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students by name, admissionNo, roll, parentName, phone, class, section
  const filteredStudents = students.filter((s) => {
    const parentPhone =
      s.parentPhone ||
      s.fatherMobile ||
      s.motherMobile ||
      s.phone ||
      s.contact ||
      s.mobile ||
      s.alternateMobile ||
      "";

    const parentName =
      s.father ||
      s.fatherName ||
      s.parentName ||
      s.mother ||
      s.motherName ||
      "";

    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.admissionNo && String(s.admissionNo).toLowerCase().includes(q)) ||
      (s.roll && String(s.roll).toLowerCase().includes(q)) ||
      (parentName && parentName.toLowerCase().includes(q)) ||
      (parentPhone && parentPhone.includes(q));

    const matchClass =
      searchClass === "All" ||
      s.className === searchClass ||
      s.class === searchClass;

    const matchSection =
      searchSection === "All" ||
      s.section === searchSection;

    return matchQuery && matchClass && matchSection;
  });

  // Compile messages for target audience (Class-wise)
  const handleCompileMessages = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/communications/compile-bulk`, {
        method: "POST",
        body: JSON.stringify({
          targetType,
          targetClass,
          targetSection,
          messageType,
          customMessage: customNoticeText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompiledResult(data.data);
        setIsConfirmModalOpen(true);
      } else {
        alert(data.message || "Failed to compile messages.");
      }
    } catch (err) {
      console.error("Compile error:", err);
      alert("Error compiling messages.");
    } finally {
      setLoading(false);
    }
  };

  // Start Sequential Runner
  const handleStartWorkflow = () => {
    setIsConfirmModalOpen(false);
    setIsWorkflowRunning(true);
    setCurrentIndex(0);
  };

  // Log and step to next student in runner
  const handleNextStep = async (status = "Opened", openUrl = false) => {
    if (!compiledResult || !compiledResult.items[currentIndex]) return;
    const currentItem = compiledResult.items[currentIndex];

    if (openUrl && currentItem.whatsappUrl) {
      window.open(currentItem.whatsappUrl, "_blank");
    }

    try {
      await fetchWithAuth(`${API_BASE_URL}/communications/log`, {
        method: "POST",
        body: JSON.stringify({
          studentId: currentItem.studentId,
          studentName: currentItem.studentName,
          recipientNumber: currentItem.normalizedPhone || currentItem.parentPhone,
          recipientName: currentItem.parentName,
          messageType,
          message: currentItem.message,
          status: openUrl ? "Opened" : status,
        }),
      });
      fetchData();
    } catch (err) {
      console.error("Log error:", err);
    }

    if (currentIndex + 1 < compiledResult.items.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsWorkflowRunning(false);
      alert("🎉 Broadcast workflow completed for all selected parents!");
    }
  };

  // Save template update
  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/communications/templates`, {
        method: "POST",
        body: JSON.stringify(editingTemplate),
      });
      const data = await res.json();
      if (data.success) {
        alert("Template saved successfully!");
        setEditingTemplate(null);
        fetchData();
      } else {
        alert(data.message || "Failed to save template.");
      }
    } catch (err) {
      console.error("Save template error:", err);
      alert("Error saving template.");
    }
  };

  const logColumns = [
    { header: "Student Name", accessor: "studentName", render: (row) => <strong>{row.studentName}</strong> },
    { header: "Parent / Phone", accessor: "recipientNumber", render: (row) => <span>{row.recipientName} ({row.recipientNumber})</span> },
    { header: "Message Type", accessor: "messageType", render: (row) => <span style={{ fontWeight: "600", color: "#1e3a8a" }}>{row.messageType}</span> },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status === "whatsapp_link_opened" ? "Opened" : row.status} /> },
    { header: "Sent By", accessor: "sentBy", render: (row) => row.sentBy?.name || "Admin" },
    { header: "Date & Time", accessor: "sentAt", render: (row) => new Date(row.sentAt).toLocaleString() }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Communication"
        title="Parent Communication Center"
        description="Send real-data WhatsApp fee updates, attendance reports, report cards, and notices directly to individual parents or whole classes."
        icon="💬"
      />

      <StatGrid>
        <StatCard title="Total Students" value={students.length} icon="👨‍🎓" />
        <StatCard title="Communication Logs" value={logs.length} icon="📜" />
        <StatCard title="Message Templates" value={templates.length || 5} icon="📝" />
        <StatCard title="WhatsApp System" value="Real DB Data & Normalization" icon="🟢" />
      </StatGrid>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #e2e8f0", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { id: "single", label: "👤 Particular Student WhatsApp", icon: "👤" },
          { id: "wizard", label: "💬 Class-Wise Broadcast", icon: "💬" },
          { id: "templates", label: "📝 Template Editor", icon: "📝" },
          { id: "logs", label: "📜 Communication Logs", icon: "📜" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              background: "none",
              borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "3px solid transparent",
              color: activeTab === tab.id ? "#2563eb" : "#64748b",
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PARTICULAR STUDENT WHATSAPP SEARCH */}
      {activeTab === "single" && (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#1e293b" }}>
            🔍 Search & Send WhatsApp Message to Particular Student Parent
          </h3>

          <div className="ui-form-row" style={{ marginBottom: "20px" }}>
            <div className="ui-form-group" style={{ flex: "2" }}>
              <label>Search Student (Name / Admission No / Roll No / Parent / Phone)</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Type student name, admission no, roll, parent name, or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ui-form-group">
              <label>Class Filter</label>
              <select
                className="ui-form-control"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
              >
                <option value="All">All Classes</option>
                <option value="PG">PG / Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11 Science">Class 11 Science</option>
                <option value="Class 11 Commerce">Class 11 Commerce</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div className="ui-form-group">
              <label>Section Filter</label>
              <select
                className="ui-form-control"
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          {studentsLoading ? (
            <p style={{ color: "#64748b", padding: "20px 0" }}>Loading student database...</p>
          ) : filteredStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b", border: "1px dashed #cbd5e1", borderRadius: "8px" }}>
              <h4>No Students Found</h4>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>Try searching with different terms or adjusting the class/section filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Student Name</th>
                    <th style={{ padding: "12px" }}>Admission / Roll</th>
                    <th style={{ padding: "12px" }}>Class</th>
                    <th style={{ padding: "12px" }}>Parent Name</th>
                    <th style={{ padding: "12px" }}>Parent WhatsApp</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.slice(0, 50).map((student) => {
                    const parentPhone =
                      student.parentPhone ||
                      student.fatherMobile ||
                      student.motherMobile ||
                      student.phone ||
                      student.contact ||
                      student.mobile ||
                      student.alternateMobile ||
                      "";

                    const parentName =
                      student.father ||
                      student.fatherName ||
                      student.parentName ||
                      student.mother ||
                      student.motherName ||
                      "Parent/Guardian";

                    const normalized = normalizePhoneNumber(parentPhone);
                    const hasValid = isValidWhatsAppNumber(parentPhone);

                    return (
                      <tr key={student.id || student._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#1e293b" }}>{student.name}</td>
                        <td style={{ padding: "12px", color: "#64748b" }}>{student.admissionNo || "—"} / Roll {student.roll || "—"}</td>
                        <td style={{ padding: "12px" }}>{student.className || student.class || "—"} {student.section ? `(${student.section})` : ""}</td>
                        <td style={{ padding: "12px" }}>{parentName}</td>
                        <td style={{ padding: "12px" }}>
                          {hasValid ? (
                            <span style={{ color: "#166534", fontWeight: "600" }}>+{normalized}</span>
                          ) : (
                            <span style={{ color: "#dc2626", fontWeight: "600" }}>⚠️ {parentPhone || "Missing"}</span>
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            type="button"
                            className="ui-btn ui-btn-primary"
                            style={{
                              backgroundColor: hasValid ? "#25D366" : "#cbd5e1",
                              color: "#ffffff",
                              cursor: hasValid ? "pointer" : "not-allowed",
                              fontSize: "13px",
                              padding: "6px 14px"
                            }}
                            disabled={!hasValid}
                            onClick={() => setSelectedStudentForWhatsApp(student)}
                          >
                            💬 Send WhatsApp
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredStudents.length > 50 && (
                <p style={{ textAlign: "center", color: "#64748b", marginTop: "12px", fontSize: "13px" }}>
                  Showing top 50 matches out of {filteredStudents.length} total students. Refine search query for more exact results.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASS BROADCAST WIZARD */}
      {activeTab === "wizard" && (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#1e293b" }}>1. Select Target Class & Communication Type</h3>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Target Class *</label>
              <select
                className="ui-form-control"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
              >
                <option value="All">All Classes (Whole School)</option>
                <option value="PG">PG / Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11 Science">Class 11 Science</option>
                <option value="Class 11 Commerce">Class 11 Commerce</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div className="ui-form-group">
              <label>Section</label>
              <select
                className="ui-form-control"
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <option value="All">All Sections (A, B, C)</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Communication Type *</label>
              <select
                className="ui-form-control"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
              >
                <option value="Fee Details">💰 Fee Details (Real DB Fees Data)</option>
                <option value="Attendance Report">📅 Attendance Report (Real DB Attendance Data)</option>
                <option value="Report Card">📝 Academic Report Card (Real DB Marks Data)</option>
                <option value="Admission Update">🎓 Admission Update (Status & Pending Items)</option>
                <option value="General Notice">📢 General Notice / Announcement</option>
              </select>
            </div>
          </div>

          {messageType === "General Notice" && (
            <div className="ui-form-group">
              <label>Notice Content *</label>
              <textarea
                className="ui-form-control"
                rows="4"
                placeholder="Enter announcement text to send to parents..."
                value={customNoticeText}
                onChange={(e) => setCustomNoticeText(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleCompileMessages}
              disabled={loading}
              className="ui-btn ui-btn-primary"
              style={{ padding: "12px 24px", fontSize: "15px" }}
            >
              {loading ? "Compiling Real DB Data..." : "🔍 Compile & Preview Messages"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATE EDITOR */}
      {activeTab === "templates" && (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#1e293b" }}>Reusable WhatsApp Message Templates</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {templates.map((tpl) => (
              <div key={tpl.id} style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong style={{ color: "#1e3a8a", fontSize: "15px" }}>{tpl.name}</strong>
                  <span style={{ fontSize: "12px", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: "10px" }}>{tpl.type}</span>
                </div>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px", backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", color: "#334155", maxHeight: "150px", overflowY: "auto" }}>
                  {tpl.content}
                </pre>
                <button
                  className="ui-btn ui-btn-secondary"
                  style={{ marginTop: "8px", fontSize: "12px" }}
                  onClick={() => setEditingTemplate(tpl)}
                >
                  ✏️ Edit Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNICATION LOGS */}
      {activeTab === "logs" && (
        <div>
          <DataTable
            columns={logColumns}
            data={logs}
            searchPlaceholder="Search by student name, number, or message type..."
          />
        </div>
      )}

      {/* Modal for Particular Student WhatsApp */}
      {selectedStudentForWhatsApp && (
        <WhatsAppModal
          student={selectedStudentForWhatsApp}
          onClose={() => setSelectedStudentForWhatsApp(null)}
        />
      )}

      {/* Confirmation Modal Before Launching Sequential Workflow */}
      <Modal
        isOpen={isConfirmModalOpen && !!compiledResult}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm WhatsApp Communication Broadcast"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleStartWorkflow} style={{ backgroundColor: "#25D366" }}>
              🟢 Start Sequential Click-to-Send Workflow
            </button>
          </>
        }
      >
        {compiledResult && (
          <div>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#334155" }}>
              Please confirm the broadcast settings before starting the sequential runner:
            </p>
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 6px 0" }}><strong>Total Target Students:</strong> {compiledResult.totalStudents}</p>
              <p style={{ margin: "0 0 6px 0", color: "#166534" }}><strong>Valid WhatsApp Numbers:</strong> {compiledResult.validCount}</p>
              <p style={{ margin: "0 0 0 0", color: "#991b1b" }}><strong>Missing / Invalid Numbers:</strong> {compiledResult.missingCount}</p>
            </div>
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#1e40af" }}>
              💡 <strong>Safety Notice:</strong> Messages will be prepared sequentially one parent at a time so your browser tabs do not crash or get blocked by WhatsApp spam limits.
            </div>
          </div>
        )}
      </Modal>

      {/* Sequential Click-to-Send Workflow Runner Modal */}
      <Modal
        isOpen={isWorkflowRunning && !!compiledResult}
        onClose={() => setIsWorkflowRunning(false)}
        title={`WhatsApp Sequential Runner (${currentIndex + 1} / ${compiledResult?.items?.length || 0})`}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <button className="ui-btn ui-btn-secondary" style={{ backgroundColor: "#ef4444", color: "#ffffff" }} onClick={() => setIsWorkflowRunning(false)}>
              🛑 Stop Workflow
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="ui-btn ui-btn-secondary" onClick={() => handleNextStep("Skipped", false)}>
                ⏭️ Skip Student
              </button>
              <button
                className="ui-btn ui-btn-primary"
                style={{ backgroundColor: "#25D366" }}
                onClick={() => handleNextStep("Opened", true)}
              >
                🟢 Open WhatsApp & Send
              </button>
            </div>
          </div>
        }
      >
        {compiledResult && compiledResult.items[currentIndex] && (
          <div>
            {/* Progress Bar */}
            <div style={{ backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{
                backgroundColor: "#25D366",
                height: "100%",
                width: `${((currentIndex + 1) / compiledResult.items.length) * 100}%`,
                transition: "width 0.3s ease"
              }} />
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 6px 0" }}><strong>Student Name:</strong> {compiledResult.items[currentIndex].studentName}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Parent Name:</strong> {compiledResult.items[currentIndex].parentName}</p>
              <p style={{ margin: "0 0 0 0" }}>
                <strong>WhatsApp Number: </strong>
                {compiledResult.items[currentIndex].isValidPhone ? (
                  <span style={{ color: "#166534", fontWeight: "700" }}>+{compiledResult.items[currentIndex].normalizedPhone}</span>
                ) : (
                  <span style={{ color: "#dc2626", fontWeight: "700" }}>⚠️ Invalid ({compiledResult.items[currentIndex].parentPhone || "Missing"})</span>
                )}
              </p>
            </div>

            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Compiled Message Preview (Real MongoDB Data)</h4>
            <pre style={{
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              backgroundColor: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "monospace"
            }}>
              {compiledResult.items[currentIndex].message}
            </pre>
          </div>
        )}
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        title={`Edit Template: ${editingTemplate?.name}`}
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setEditingTemplate(null)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleSaveTemplate}>Save Template</button>
          </>
        }
      >
        {editingTemplate && (
          <form onSubmit={handleSaveTemplate}>
            <div className="ui-form-group">
              <label>Template Name</label>
              <input
                type="text"
                className="ui-form-control"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
              />
            </div>
            <div className="ui-form-group">
              <label>Template Content (Use variables like {"{{studentName}}"}, {"{{class}}"}, {"{{totalFee}}"}, etc.)</label>
              <textarea
                className="ui-form-control"
                rows="8"
                value={editingTemplate.content}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default ParentCommunication;