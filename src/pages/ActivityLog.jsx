import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import "../Style/ui.css";

const INITIAL_LOGS = [
  {
    id: "LOG-9001",
    timestamp: "2026-09-08 10:30:15",
    userName: "School Admin",
    role: "Admin",
    action: "User Authentication",
    module: "Auth",
    details: "Logged into system dashboard",
    ipAddress: "192.168.1.10",
    status: "Success"
  },
  {
    id: "LOG-9002",
    timestamp: "2026-09-08 09:45:22",
    userName: "Sunita Verma",
    role: "Teacher",
    action: "Student Attendance Marked",
    module: "Attendance",
    details: "Class 10-A daily attendance saved (38 Present)",
    ipAddress: "192.168.1.42",
    status: "Success"
  },
  {
    id: "LOG-9003",
    timestamp: "2026-09-07 16:20:00",
    userName: "Accounts Manager",
    role: "Accountant",
    action: "Fee Payment Recorded",
    module: "Fees",
    details: "Recorded payment ₹15,000 for Aarav Sharma",
    ipAddress: "192.168.1.18",
    status: "Success"
  },
  {
    id: "LOG-9004",
    timestamp: "2026-09-07 14:10:05",
    userName: "Ramesh Sharma",
    role: "Teacher",
    action: "Exam Marks Updated",
    module: "Results",
    details: "Entered Mid-Term Mathematics marks for 35 students",
    ipAddress: "192.168.1.35",
    status: "Success"
  }
];

export function ActivityLog() {
  const [logs] = useState(INITIAL_LOGS);

  const columns = [
    { header: "Timestamp", accessor: "timestamp", render: (row) => <strong>{row.timestamp}</strong> },
    { header: "User", accessor: "userName", render: (row) => `${row.userName} (${row.role})` },
    { header: "Action Executed", accessor: "action" },
    { header: "Module", accessor: "module", render: (row) => <span className="ui-badge ui-badge-purple">{row.module}</span> },
    { header: "Details", accessor: "details" },
    { header: "IP Address", accessor: "ipAddress" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Security"
        title="Audit & Activity Logs"
        description="Monitor system interactions, administrative changes, logins, and audit trails."
        icon="📜"
      />

      <StatGrid>
        <StatCard title="Total Audit Logs" value={logs.length} icon="📜" />
        <StatCard title="Admin Actions" value={logs.filter((l) => l.role === "Admin").length} icon="🧑‍💼" />
        <StatCard title="Academic Transactions" value={logs.filter((l) => l.module === "Results" || l.module === "Attendance").length} icon="📝" />
        <StatCard title="Successful Operations" value="100%" icon="✅" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit logs by user, action, module, IP..."
        filters={[
          { key: "role", label: "Role", options: [{ value: "Admin", label: "Admin" }, { value: "Teacher", label: "Teacher" }, { value: "Accountant", label: "Accountant" }] },
          { key: "module", label: "Module", options: [{ value: "Auth", label: "Auth" }, { value: "Attendance", label: "Attendance" }, { value: "Fees", label: "Fees" }, { value: "Results", label: "Results" }] }
        ]}
      />
    </div>
  );
}

export default ActivityLog;