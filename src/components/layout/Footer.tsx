import { Link } from 'react-router-dom'
import { PaymentPartners } from '../system/PaymentPartners'
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <p className="footer-wordmark">PUNTA</p>
          <p className="footer-tag">Where will you stay?</p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="footer-head">Explore</p>
            <Link to="/explore?where=Palawan">Palawan</Link>
            <Link to="/explore?where=Siargao">Siargao</Link>
            <Link to="/explore?where=Batangas">Batangas</Link>
            <Link to="/explore?where=Baguio">Baguio</Link>
          </div>
          <div>
            <p className="footer-head">Company</p>
            <Link to="/host">Become a host</Link>
            <Link to="/trips">My trips</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div>
            <p className="footer-head">Promise</p>
            <p className="footer-line">Beautiful places. Meaningful escapes.</p>
            <p className="footer-line">
              Every stay on PUNTA is visited, verified, and loved by someone on our
              team before it reaches you.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-mark" aria-hidden="true">
        <span>PUNTA</span>
      </div>

      <div className="shell footer-pay">
        <PaymentPartners />
      </div>

      <div className="shell footer-base">
        <p>© 2026 PUNTA. A fictional hospitality company.</p>
        <p>Made for the Philippines — 7,641 islands, one home.</p>
      </div>
    </footer>
  )
}
