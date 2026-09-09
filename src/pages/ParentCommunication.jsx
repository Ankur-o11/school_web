import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_HISTORY = [
  {
    id: "MSG-801",
    title: "Parent-Teacher Meeting Announcement",
    targetClass: "All Classes",
    channel: "WhatsApp & SMS",
    sentBy: "Principal Office",
    dateSent: "2026-09-02 10:30 AM",
    recipients: 480,
    status: "Completed"
  },
  {
    id: "MSG-802",
    title: "Fee Reminder - Q3 Term Installment",
    targetClass: "Class 10-A",
    channel: "WhatsApp",
    sentBy: "Accounts Department",
    dateSent: "2026-09-05 02:15 PM",
    recipients: 38,
    status: "Completed"
  },
  {
    id: "MSG-803",
    title: "Urgent School Closure due to Heavy Rain",
    targetClass: "All Classes",
    channel: "SMS Broadcast",
    sentBy: "Admin Office",
    dateSent: "2026-08-28 07:00 AM",
    recipients: 520,
    status: "Completed"
  }
];

export function ParentCommunication() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetClass: "All Classes",
    channel: "WhatsApp & SMS",
    message: ""
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    const newMsg = {
      id: `MSG-${Math.floor(800 + Math.random() * 200)}`,
      title: formData.title,
      targetClass: formData.targetClass,
      channel: formData.channel,
      sentBy: "School Admin",
      dateSent: new Date().toLocaleString(),
      recipients: formData.targetClass === "All Classes" ? 500 : 40,
      status: "Completed"
    };
    setHistory([newMsg, ...history]);
    setIsModalOpen(false);
    setFormData({ title: "", targetClass: "All Classes", channel: "WhatsApp & SMS", message: "" });
    alert("Parent broadcast message sent successfully!");
  };

  const columns = [
    { header: "Message Subject", accessor: "title", render: (row) => <strong>{row.title}</strong> },
    { header: "Target Audience", accessor: "targetClass" },
    { header: "Channel", accessor: "channel" },
    { header: "Sent By", accessor: "sentBy" },
    { header: "Date & Time", accessor: "dateSent" },
    { header: "Recipients", accessor: "recipients", render: (row) => `${row.recipients} Parents` },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Communication"
        title="Parent Communication Center"
        description="Broadcast notices, WhatsApp alerts, and SMS messages directly to parents."
        icon="💬"
        primaryAction={{
          label: "New Broadcast Message",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Messages Sent" value={history.length} icon="💬" />
        <StatCard title="Total Parent Reach" value="1,248 Parents" icon="👨‍👩‍👧" />
        <StatCard title="WhatsApp Delivery Rate" value="99.4%" icon="🟢" />
        <StatCard title="SMS Success Rate" value="98.1%" icon="📱" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={history}
        searchPlaceholder="Search communication log..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Send Parent Broadcast Message"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleSendBroadcast}>Send Broadcast Now</button>
          </>
        }
      >
        <form onSubmit={handleSendBroadcast}>
          <div className="ui-form-group">
            <label>Message Title / Subject *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Important Notification Regarding Exams"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Target Audience *</label>
              <select
                className="ui-form-control"
                value={formData.targetClass}
                onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
              >
                <option value="All Classes">All Parents (Entire School)</option>
                <option value="Class 9-A">Class 9-A Parents</option>
                <option value="Class 10-A">Class 10-A Parents</option>
                <option value="Class 12-A">Class 12-A Parents</option>
              </select>
            </div>

            <div className="ui-form-group">
              <label>Delivery Channel</label>
              <select
                className="ui-form-control"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              >
                <option value="WhatsApp & SMS">WhatsApp & SMS</option>
                <option value="WhatsApp">WhatsApp Only</option>
                <option value="SMS Broadcast">SMS Only</option>
                <option value="In-App Notification">In-App Notice Only</option>
              </select>
            </div>
          </div>

          <div className="ui-form-group">
            <label>Message Content *</label>
            <textarea
              className="ui-form-control"
              rows={4}
              placeholder="Type your official message to parents..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ParentCommunication;