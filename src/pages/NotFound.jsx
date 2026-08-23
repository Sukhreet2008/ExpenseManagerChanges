// A simple 404 page shown if the app somehow tries to display an
// unknown page. Since this project does not use a router library,
// "going back" simply means switching the page state back to dashboard.

function NotFound({ onGoHome }) {
  return (
    <div className="page not-found">
      <p className="not-found-code">404</p>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button className="btn btn-primary" onClick={onGoHome}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default NotFound;
