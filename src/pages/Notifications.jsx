import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import "../Style/ui.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    title: "Monthly Fee Payment Received",
    message: "Fee receipt #REC-9821 has been generated for Aarav Sharma (Class 10-A).",
    category: "Fees",
    timestamp: "10 minutes ago",
    isRead: false
  },
  {
    id: "NOTIF-102",
    title: "Mid-Term Examination Result Published",
    message: "Physics and Mathematics marksheets for Class 12-A have been published online.",
    category: "Results",
    timestamp: "1 hour ago",
    isRead: false
  },
  {
    id: "NOTIF-103",
    title: "Daily Student Attendance Alert",
    message: "Class 9-B attendance marked with 3 absent students.",
    category: "Attendance",
    timestamp: "3 hours ago",
    isRead: true
  },
  {
    id: "NOTIF-104",
    title: "Staff Meeting Reminder",
    message: "Principal has scheduled an emergency meeting in Conference Room 2.",
    category: "General",
    timestamp: "Yesterday",
    isRead: true
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const columns = [
    {
      header: "Notification",
      accessor: "title",
      render: (row) => (
        <div>
          <strong style={{ display: "block", color: row.isRead ? "var(--text-muted)" : "var(--text-main)" }}>
            {!row.isRead && <span style={{ color: "#2563eb", marginRight: "6px" }}>●</span>}
            {row.title}
          </strong>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{row.message}</span>
        </div>
      )
    },
    { header: "Category", accessor: "category", render: (row) => <span className="ui-badge ui-badge-purple">{row.category}</span> },
    { header: "Time", accessor: "timestamp" },
    {
      header: "Status",
      accessor: "isRead",
      render: (row) => (
        <StatusBadge status={row.isRead ? "Read" : "Unread"} type={row.isRead ? "neutral" : "warning"} />
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <button
          className="ui-btn ui-btn-secondary ui-btn-sm"
          onClick={() =>
            setNotifications(
              notifications.map((n) => (n.id === row.id ? { ...n, isRead: true } : n))
            )
          }
        >
          Mark Read
        </button>
      )
    }
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Activity"
        title="Notifications Center"
        description="View system notifications, alerts, fee updates, and academic announcements."
        icon="🔔"
        secondaryActions={
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="ui-btn ui-btn-secondary" onClick={markAllRead}>
              ✓ Mark All as Read
            </button>
            <button className="ui-btn ui-btn-secondary" onClick={clearAll}>
              🗑️ Clear Notifications
            </button>
          </div>
        }
      />

      <StatGrid>
        <StatCard title="Total Notifications" value={notifications.length} icon="🔔" />
        <StatCard title="Unread Alerts" value={unreadCount} icon="🔴" />
        <StatCard title="Fee & Financial Alerts" value={notifications.filter((n) => n.category === "Fees").length} icon="💰" />
        <StatCard title="Academic Updates" value={notifications.filter((n) => n.category === "Results").length} icon="📝" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={notifications}
        searchPlaceholder="Search notifications..."
        filters={[
          { key: "category", label: "Category", options: [{ value: "Fees", label: "Fees" }, { value: "Results", label: "Results" }, { value: "Attendance", label: "Attendance" }, { value: "General", label: "General" }] }
        ]}
      />
    </div>
  );
}

export default Notifications;