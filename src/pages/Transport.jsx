import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_ROUTES = [
  {
    id: "TR-01",
    routeName: "Route A - North Sector",
    vehicleNo: "DL-01-AB-1234",
    driverName: "Ram Singh",
    driverPhone: "+91 9876543210",
    stops: "Sector 14, Sector 18, Model Town",
    capacity: 45,
    assignedStudents: 40,
    status: "Active"
  },
  {
    id: "TR-02",
    routeName: "Route B - West Colony",
    vehicleNo: "DL-01-XY-5678",
    driverName: "Suresh Kumar",
    driverPhone: "+91 9812345678",
    stops: "Paschim Vihar, Punjabi Bagh, Rajouri",
    capacity: 40,
    assignedStudents: 38,
    status: "Active"
  },
  {
    id: "TR-03",
    routeName: "Route C - East City",
    vehicleNo: "DL-01-MN-9101",
    driverName: "Mukesh Yadav",
    driverPhone: "+91 9898989898",
    stops: "Laxmi Nagar, Preet Vihar, Anand Vihar",
    capacity: 50,
    assignedStudents: 50,
    status: "Active"
  }
];

export function Transport() {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    routeName: "",
    vehicleNo: "",
    driverName: "",
    driverPhone: "",
    capacity: 40
  });

  const handleAddRoute = (e) => {
    e.preventDefault();
    const newRt = {
      id: `TR-0${routes.length + 1}`,
      routeName: formData.routeName,
      vehicleNo: formData.vehicleNo,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      stops: "School Main Gate",
      capacity: parseInt(formData.capacity) || 40,
      assignedStudents: 0,
      status: "Active"
    };
    setRoutes([...routes, newRt]);
    setIsModalOpen(false);
    setFormData({ routeName: "", vehicleNo: "", driverName: "", driverPhone: "", capacity: 40 });
  };

  const columns = [
    { header: "Route Name", accessor: "routeName", render: (row) => <strong>{row.routeName}</strong> },
    { header: "Vehicle Number", accessor: "vehicleNo" },
    { header: "Driver Name", accessor: "driverName" },
    { header: "Contact", accessor: "driverPhone" },
    { header: "Stops / Coverage", accessor: "stops" },
    { header: "Occupancy", accessor: "assignedStudents", render: (row) => `${row.assignedStudents} / ${row.capacity} Seats` },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Student List", icon: "👥", onClick: () => alert(`Viewing students in ${row.routeName}`) },
            { label: "Delete Route", icon: "🗑️", danger: true, onClick: () => setRoutes(routes.filter((r) => r.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  const totalCapacity = routes.reduce((sum, r) => sum + r.capacity, 0);
  const totalAssigned = routes.reduce((sum, r) => sum + r.assignedStudents, 0);

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Operations"
        title="Transport Management"
        description="Manage school bus fleet, drivers, routes, and student pickup/drop allocations."
        icon="🚌"
        primaryAction={{
          label: "Add Bus Route",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Active Routes" value={routes.length} icon="🚌" />
        <StatCard title="Fleet Vehicles" value={routes.length} icon="🚐" />
        <StatCard title="Assigned Students" value={totalAssigned} icon="👨‍🎓" />
        <StatCard title="Capacity Utilization" value={`${Math.round((totalAssigned / (totalCapacity || 1)) * 100)}%`} icon="📊" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={routes}
        searchPlaceholder="Search routes, bus no., driver name..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Bus Route & Vehicle"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleAddRoute}>Save Route</button>
          </>
        }
      >
        <form onSubmit={handleAddRoute}>
          <div className="ui-form-group">
            <label>Route Designation *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Route D - South Extension"
              value={formData.routeName}
              onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Bus Registration No. *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="DL-01-XX-0000"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Seating Capacity</label>
              <input
                type="number"
                className="ui-form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Driver Full Name *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Driver Name"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Driver Phone Number *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="+91 Mobile No"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Transport;