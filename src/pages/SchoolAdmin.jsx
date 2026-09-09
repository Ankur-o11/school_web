import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import { useNavigate } from "react-router-dom";
import "../Style/ui.css";

export function SchoolAdmin() {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Roles & Permission Matrix",
      desc: "Configure role-based access control (RBAC), view granular action permissions for Admin, Teacher, Student, Parent, and Accountant.",
      icon: "🔐",
      route: "/roles-permissions"
    },
    {
      title: "Audit & Activity Logs",
      desc: "Track real-time system activities, user login history, administrative modifications, and IP addresses.",
      icon: "📜",
      route: "/activity-log"
    },
    {
      title: "System Settings",
      desc: "Manage school campus details, CBSE affiliation settings, fee receipt defaults, and academic terms.",
      icon: "⚙️",
      route: "/settings"
    },
    {
      title: "Reports & Analytics Center",
      desc: "Generate cross-modular school reports for attendance, fee collections, examination matrices, and inventory.",
      icon: "📊",
      route: "/reports"
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Administration"
        title="School Super Admin Control Center"
        description="Centralized administration hub for system configuration, security rules, RBAC matrix, and audit trails."
        icon="🧑‍💼"
      />

      <StatGrid>
        <StatCard title="System Administrator" value="Active Session" icon="🧑‍💼" />
        <StatCard title="Configured User Roles" value="6 Roles" icon="🔐" />
        <StatCard title="System Health" value="100% Operational" icon="💚" />
        <StatCard title="DB Connection" value="MongoDB Atlas" icon="⚡" />
      </StatGrid>

      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px" }}>
        Administrative Control Modules
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}
      >
        {adminModules.map((mod, idx) => (
          <div
            key={idx}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{mod.icon}</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
                {mod.title}
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {mod.desc}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                className="ui-btn ui-btn-primary"
                style={{ width: "100%" }}
                onClick={() => navigate(mod.route)}
              >
                Open {mod.title} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchoolAdmin;