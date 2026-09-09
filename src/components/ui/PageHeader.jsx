import "../../Style/ui.css";

export function PageHeader({ title, description, icon, breadcrumb = "Home", primaryAction, secondaryActions }) {
  return (
    <div className="ui-page-header">
      <div className="ui-page-header-top">
        <div className="ui-page-title-group">
          {breadcrumb && (
            <div className="ui-breadcrumb">
              <span>{breadcrumb}</span>
              <span>/</span>
              <span style={{ color: "var(--text-main)", fontWeight: "500" }}>{title}</span>
            </div>
          )}
          <h1>
            {icon && <span>{icon}</span>}
            {title}
          </h1>
          {description && <p>{description}</p>}
        </div>

        <div className="ui-header-actions">
          {secondaryActions}
          {primaryAction && (
            <button className="ui-btn ui-btn-primary" onClick={primaryAction.onClick}>
              {primaryAction.icon || "+"} {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
