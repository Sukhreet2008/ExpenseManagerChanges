import { useNavigate } from "react-router-dom";

// 404 Page Not Found: Rendered when no registered route matches.
// Uses React Router useNavigate for programmatic redirection to dashboard.
function NotFound({ onGoHome }) {
  const navigate = useNavigate();

  function handleClick() {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
    }
  }

  return (
    <div className="page not-found">
      <p className="not-found-code">404</p>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button type="button" className="btn btn-primary" onClick={handleClick}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default NotFound;
