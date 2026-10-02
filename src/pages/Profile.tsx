import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { useSession, MEMBER_RATE } from '../state/SessionContext'
import { SignInControl } from '../components/entry/MemberBar'
import { RegionPicker } from '../components/layout/RegionPicker'
import './profile.css'

export default function Profile() {
  const { wishlist, trips } = useApp()
  const { member, isMember, signOut } = useSession()

  const displayName = member ? member.name.split(' ')[0] : 'Traveler'
  const initial = displayName[0]?.toUpperCase() ?? 'P'

  return (
    <div className="profile shell">
      <header className="page-head">
        <p className="eyebrow eyebrow--dark">Good day</p>
        <h1 className="h1">{displayName}</h1>
      </header>

      <div className="profile-grid">
        <div className="profile-card">
          <span className="profile-avatar" aria-hidden="true">{initial}</span>
          <div>
            <p className="profile-name">
              {member ? member.name : 'Browsing as guest'}
            </p>
            <p className="muted">
              {member ? `${member.email} · Manila` : 'Traveling slowly · Manila'}
            </p>
          </div>
        </div>

        <div className={`profile-join${isMember ? ' is-member' : ''}`}>
          {isMember ? (
            <>
              <p className="h3">Member rate is on</p>
              <p className="muted profile-join-sub">
                You're saving {MEMBER_RATE * 100}% on every stay — the discount
                is already reflected in every price you see.
              </p>
            </>
          ) : (
            <>
              <p className="h3">Like what you see?</p>
              <p className="muted profile-join-sub">
                Sign in to switch on member rates — {MEMBER_RATE * 100}% off
                every stay, applied everywhere instantly.
              </p>
              <SignInControl variant="profile" />
            </>
          )}
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <p className="profile-num">{trips.filter((t) => t.status === 'upcoming').length}</p>
            <p className="muted">Upcoming trips</p>
          </div>
          <div className="profile-stat">
            <p className="profile-num">{trips.length}</p>
            <p className="muted">Total bookings</p>
          </div>
          <div className="profile-stat">
            <p className="profile-num">{wishlist.length}</p>
            <p className="muted">Saved places</p>
          </div>
        </div>

        <div className="profile-section">
          <p className="h3">Plan the journey</p>
          <div className="profile-links">
            <Link to="/mytrip" className="profile-link">My trip planner <span className="muted">→</span></Link>
            <Link to="/esim" className="profile-link">Your eSIMs <span className="muted">→</span></Link>
            <Link to="/map" className="profile-link">Map <span className="muted">→</span></Link>
          </div>
        </div>

        <div className="profile-section">
          <p className="h3">Discover</p>
          <div className="profile-links">
            <Link to="/destinations" className="profile-link">Destination guides <span className="muted">→</span></Link>
            <Link to="/experiences" className="profile-link">Experiences <span className="muted">→</span></Link>
            <Link to="/dining" className="profile-link">Dining <span className="muted">→</span></Link>
            <Link to="/transportation" className="profile-link">Transportation <span className="muted">→</span></Link>
          </div>
        </div>

        <div className="profile-region">
          <RegionPicker variant="profile" />
        </div>

        <div className="profile-links">
          <Link to="/wishlist" className="profile-link">Wishlist <span className="muted">→</span></Link>
          <Link to="/trips" className="profile-link">My trips <span className="muted">→</span></Link>
          <Link to="/host" className="profile-link">Become a host <span className="muted">→</span></Link>
        </div>

        {isMember && (
          <button type="button" className="btn btn--ghost profile-signout" onClick={signOut}>
            Sign out
          </button>
        )}

        <p className="muted profile-note">
          This is a prototype profile. Membership lives in this browser only —
          in production this connects to real accounts and verification.
        </p>
      </div>
    </div>
  )
}
