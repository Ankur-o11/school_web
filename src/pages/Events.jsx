import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_EVENTS = [
  {
    id: "EVT-01",
    title: "Annual Sports Day 2026",
    category: "Sports",
    date: "2026-09-25",
    time: "09:00 AM - 04:00 PM",
    venue: "Main Athletic Ground",
    targetAudience: "All Students",
    status: "Upcoming"
  },
  {
    id: "EVT-02",
    title: "Inter-School Science Exhibition",
    category: "Academic",
    date: "2026-10-05",
    time: "10:00 AM - 02:00 PM",
    venue: "Science Auditorium",
    targetAudience: "Classes 8-12",
    status: "Upcoming"
  },
  {
    id: "EVT-03",
    title: "Independence Day Cultural Function",
    category: "Cultural",
    date: "2026-08-15",
    time: "08:00 AM - 12:00 PM",
    venue: "School Amphitheatre",
    targetAudience: "School Wide",
    status: "Completed"
  }
];

export function Events() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    date: "",
    time: "10:00 AM",
    venue: "School Auditorium",
    targetAudience: "All Students"
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvt = {
      id: `EVT-0${events.length + 1}`,
      title: formData.title,
      category: formData.category,
      date: formData.date || "2026-10-15",
      time: formData.time,
      venue: formData.venue,
      targetAudience: formData.targetAudience,
      status: "Upcoming"
    };
    setEvents([newEvt, ...events]);
    setIsModalOpen(false);
    setFormData({ title: "", category: "Academic", date: "", time: "10:00 AM", venue: "School Auditorium", targetAudience: "All Students" });
  };

  const columns = [
    { header: "Event Title", accessor: "title", render: (row) => <strong>{row.title}</strong> },
    { header: "Category", accessor: "category", render: (row) => <span className="ui-badge ui-badge-info">{row.category}</span> },
    { header: "Date & Time", accessor: "date", render: (row) => `${row.date} • ${row.time}` },
    { header: "Venue / Location", accessor: "venue" },
    { header: "Audience", accessor: "targetAudience" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Details", icon: "👁️", onClick: () => alert(`Event: ${row.title}`) },
            { label: "Delete Event", icon: "🗑️", danger: true, onClick: () => setEvents(events.filter((e) => e.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Activities"
        title="School Events & Programs"
        description="Schedule, manage, and announce academic, cultural, and sports events."
        icon="🏆"
        primaryAction={{
          label: "Add New Event",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Events Scheduled" value={events.length} icon="🏆" />
        <StatCard title="Upcoming Programs" value={events.filter((e) => e.status === "Upcoming").length} icon="📅" />
        <StatCard title="Completed Events" value={events.filter((e) => e.status === "Completed").length} icon="✅" />
        <StatCard title="Sports & Cultural" value={events.filter((e) => e.category !== "Academic").length} icon="🎨" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={events}
        searchPlaceholder="Search event title, venue, category..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule School Event"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleAddEvent}>Schedule Event</button>
          </>
        }
      >
        <form onSubmit={handleAddEvent}>
          <div className="ui-form-group">
            <label>Event Name *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Annual Art & Craft Competition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Event Category</label>
              <select
                className="ui-form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Celebration">Celebration</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Target Audience</label>
              <input
                type="text"
                className="ui-form-control"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Date *</label>
              <input
                type="date"
                className="ui-form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Time Schedule</label>
              <input
                type="text"
                className="ui-form-control"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-group">
            <label>Venue / Location</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Main Auditorium, Ground"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Events;