import { useState, useRef, useEffect } from "react";
import "../../Style/ui.css";

export function ActionMenu({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!actions.length) return null;

  return (
    <div className="ui-action-menu" ref={menuRef}>
      <button
        type="button"
        className="ui-btn-icon"
        onClick={() => setIsOpen(!isOpen)}
        title="More Actions"
      >
        •••
      </button>

      {isOpen && (
        <div className="ui-action-dropdown">
          {actions.map((act, idx) => (
            <button
              key={idx}
              type="button"
              className={`ui-action-item ${act.danger ? "danger" : ""}`}
              onClick={() => {
                setIsOpen(false);
                if (act.onClick) act.onClick();
              }}
            >
              {act.icon && <span>{act.icon}</span>}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
