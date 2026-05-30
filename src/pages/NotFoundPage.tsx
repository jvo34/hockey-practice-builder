import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card">
      <p className="eyebrow">404</p>
      <h2>Page not found</h2>
      <p className="muted">This route does not exist in the hockey practice builder.</p>
      <Link className="button button--primary" to="/">
        Return to dashboard
      </Link>
    </section>
  );
}
