import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_PARENTS = [
  {
    id: "PRT-001",
    name: "Vikram Sharma",
    phone: "+91 9876543210",
    email: "vikram.sharma@example.com",
    address: "H.No 42, Sector 14, New Delhi",
    children: ["Aarav Sharma (Class 10-A)"],
    status: "Active"
  },
  {
    id: "PRT-002",
    name: "Sanjay Patel",
    phone: "+91 9812345678",
    email: "sanjay.p@example.com",
    address: "B-12, Model Town, Delhi",
    children: ["Ananya Patel (Class 10-A)", "Rohan Patel (Class 6-B)"],
    status: "Active"
  },
  {
    id: "PRT-003",
    name: "Rajesh Verma",
    phone: "+91 9898989898",
    email: "r.verma@example.com",
    address: "C-4, Punjabi Bagh, Delhi",
    children: ["Rohan Verma (Class 12-A)"],
    status: "Active"
  }
];

export function Parents() {
  const [parents] = useState(INITIAL_PARENTS);
  const [selectedParent, setSelectedParent] = useState(null);

  const columns = [
    { header: "Parent Name", accessor: "name", render: (row) => <strong>{row.name}</strong> },
    { header: "Phone Number", accessor: "phone" },
    { header: "Email Address", accessor: "email" },
    { header: "Address", accessor: "address" },
    {
      header: "Linked Children",
      accessor: "children",
      render: (row) => (
        <div>
          {row.children.map((c, idx) => (
            <span key={idx} className="ui-badge ui-badge-purple" style={{ marginRight: "4px", marginBottom: "2px" }}>
              {c}
            </span>
          ))}
        </div>
      )
    },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Parent Profile", icon: "👤", onClick: () => setSelectedParent(row) },
            { label: "Send Message", icon: "💬", onClick: () => alert(`Sending message to ${row.name}`) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Directory"
        title="Parent Directory"
        description="Manage parent profiles, linked students, contact numbers, and communication channels."
        icon="👨‍👩‍👧"
      />

      <StatGrid>
        <StatCard title="Registered Parents" value={parents.length} icon="👨‍👩‍👧" />
        <StatCard title="Multiple-Child Families" value={parents.filter((p) => p.children.length > 1).length} icon="👨‍👩‍👧‍👦" />
        <StatCard title="Verified Phone Contacts" value="100%" icon="📱" />
        <StatCard title="Active Status" value="100%" icon="✅" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={parents}
        searchPlaceholder="Search parent name, phone, student name..."
      />

      {/* Parent Profile Modal */}
      <Modal
        isOpen={!!selectedParent}
        onClose={() => setSelectedParent(null)}
        title={`Parent Profile: ${selectedParent?.name}`}
        footer={
          <button className="ui-btn ui-btn-secondary" onClick={() => setSelectedParent(null)}>Close Profile</button>
        }
      >
        {selectedParent && (
          <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
            <p><strong>Parent Full Name:</strong> {selectedParent.name}</p>
            <p><strong>Primary Phone:</strong> {selectedParent.phone}</p>
            <p><strong>Email Address:</strong> {selectedParent.email}</p>
            <p><strong>Residential Address:</strong> {selectedParent.address}</p>
            <div style={{ marginTop: "16px" }}>
              <strong>Enrolled Children:</strong>
              <div style={{ marginTop: "8px" }}>
                {selectedParent.children.map((c, i) => (
                  <div key={i} style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "6px" }}>
                    🎓 {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Parents;