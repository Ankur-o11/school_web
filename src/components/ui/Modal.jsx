import "../../Style/ui.css";

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "560px" }) {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div
        className="ui-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-modal-header">
          <h2>{title}</h2>
          <button type="button" className="ui-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
