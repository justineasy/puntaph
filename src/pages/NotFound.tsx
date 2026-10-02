import { Link } from 'react-router-dom'
import './notfound.css'

export default function NotFound() {
  return (
    <div className="nf shell">
      <p className="eyebrow eyebrow--dark">Off the map</p>
      <h1 className="display">You’ve wandered.</h1>
      <p className="muted nf-sub">
        This page doesn’t exist — but plenty of places do.
      </p>
      <Link to="/" className="btn btn--primary">Back to the homepage</Link>
      <Link to="/explore" className="more">or browse all stays</Link>
    </div>
  )
}
