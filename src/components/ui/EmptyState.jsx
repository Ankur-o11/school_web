import "../../Style/ui.css";

export function EmptyState({ icon = "🔍", title = "No records found", description = "Try refining your search or add a new record to get started.", action }) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <div style={{ marginTop: "16px" }}>
          <button className="ui-btn ui-btn-primary" onClick={action.onClick}>
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
