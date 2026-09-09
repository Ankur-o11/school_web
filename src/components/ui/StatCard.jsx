import "../../Style/ui.css";

export function StatCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="ui-stat-card">
      <div className="ui-stat-info">
        <span>{title}</span>
        <strong>{value !== undefined && value !== null ? value : "N/A"}</strong>
        {subtitle && <div className="ui-stat-sub">{subtitle}</div>}
      </div>
      {icon && <div className="ui-stat-icon">{icon}</div>}
    </div>
  );
}

export function StatGrid({ children }) {
  return <div className="ui-stat-grid">{children}</div>;
}

export default StatCard;
