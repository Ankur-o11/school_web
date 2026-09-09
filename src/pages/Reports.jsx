import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import "../Style/ui.css";

const REPORT_MODULES = [
  { id: "REP-01", name: "Student Enrolment & Demographic Report", category: "Students", format: "PDF / CSV", generatedOn: "2026-09-08" },
  { id: "REP-02", name: "Monthly Attendance Summary (Class 10-A)", category: "Attendance", format: "PDF / Excel", generatedOn: "2026-09-01" },
  { id: "REP-03", name: "Fee Collection & Pending Defaulters List", category: "Fees", format: "PDF / CSV", generatedOn: "2026-09-05" },
  { id: "REP-04", name: "Mid-Term Academic Performance Matrix", category: "Results", format: "Excel / PDF", generatedOn: "2026-08-30" },
  { id: "REP-05", name: "Teacher Monthly Payroll & Disbursement Log", category: "Payroll", format: "PDF", generatedOn: "2026-09-01" },
  { id: "REP-06", name: "Transport Route Capacity & Student Allocations", category: "Transport", format: "CSV", generatedOn: "2026-08-25" }
];

export function Reports() {
  const [reportsList] = useState(REPORT_MODULES);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredReports = selectedCategory === "ALL" 
    ? reportsList 
    : reportsList.filter(r => r.category === selectedCategory);

  const columns = [
    { header: "Report Title", accessor: "name", render: (row) => <strong>{row.name}</strong> },
    { header: "Category", accessor: "category", render: (row) => <span className="ui-badge ui-badge-purple">{row.category}</span> },
    { header: "Export Formats", accessor: "format" },
    { header: "Last Generated", accessor: "generatedOn" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => window.print()}>
            🖨️ Print
          </button>
          <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => alert(`Exporting ${row.name} as CSV`)}>
            📥 Export CSV
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Analytics"
        title="Reports & Analytics Center"
        description="Generate, view, and export comprehensive school administrative reports."
        icon="📊"
      />

      <StatGrid>
        <StatCard title="Available Report Types" value="24 Reports" icon="📊" />
        <StatCard title="Student Analytics" value="6 Reports" icon="👨‍🎓" />
        <StatCard title="Financial & Fee Reports" value="5 Reports" icon="💰" />
        <StatCard title="Attendance & Payroll" value="7 Reports" icon="📅" />
      </StatGrid>

      {/* Category filter tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["ALL", "Students", "Attendance", "Fees", "Results", "Payroll", "Transport"].map((cat) => (
          <button
            key={cat}
            className={`ui-btn ${selectedCategory === cat ? "ui-btn-primary" : "ui-btn-secondary"} ui-btn-sm`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "ALL" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredReports}
        searchPlaceholder="Search available report modules..."
      />
    </div>
  );
}

export default Reports;