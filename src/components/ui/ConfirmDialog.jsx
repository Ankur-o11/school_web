import Modal from "./Modal";

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?", confirmText = "Confirm", confirmVariant = "primary", loading = false }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="ui-btn ui-btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`ui-btn ${confirmVariant === "danger" ? "ui-btn-danger" : "ui-btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <p style={{ margin: 0, color: "var(--text-main)", fontSize: "14px" }}>{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
