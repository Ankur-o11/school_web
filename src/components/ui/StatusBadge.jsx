import "../../Style/ui.css";

export function StatusBadge({ status, type }) {
  let badgeClass = "ui-badge-neutral";
  let label = status || "Unknown";

  const lower = String(status).toLowerCase();

  if (type === "success" || lower === "active" || lower === "approved" || lower === "paid" || lower === "present" || lower === "completed" || lower === "published") {
    badgeClass = "ui-badge-success";
  } else if (type === "warning" || lower === "pending" || lower === "under review" || lower === "partial" || lower === "leave" || lower === "low stock" || lower === "assigned") {
    badgeClass = "ui-badge-warning";
  } else if (type === "danger" || lower === "inactive" || lower === "rejected" || lower === "overdue" || lower === "absent" || lower === "out of stock" || lower === "expired" || lower === "unpaid") {
    badgeClass = "ui-badge-danger";
  } else if (type === "info" || lower === "upcoming" || lower === "submitted" || lower === "issued" || lower === "draft") {
    badgeClass = "ui-badge-info";
  } else if (type === "purple" || lower === "in progress" || lower === "graded") {
    badgeClass = "ui-badge-purple";
  }

  return <span className={`ui-badge ${badgeClass}`}>{label}</span>;
}

export default StatusBadge;
