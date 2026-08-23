// A simple reusable "nothing to show here" message with an optional button.
// Used when there are no transactions to display.

function EmptyState({ title, message, buttonLabel, onButtonClick }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🗒️</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {buttonLabel && onButtonClick && (
        <button className="btn btn-primary" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
