import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./ConfirmDialog.module.css";

// "Are you sure?" for actions that can't be undone.
//   busy  true while the action runs (the confirm button shows a spinner)
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" loading={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
