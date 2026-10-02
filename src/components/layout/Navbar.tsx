import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../state/AppContext'
import { useSession } from '../../state/SessionContext'
import { SignInControl } from '../entry/MemberBar'
import { RegionPicker } from './RegionPicker'
import { useOwnedSims } from '../../hooks/useOwnedSims'
import { IconHeart } from '../system/Icons'
import './navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { wishlist, trips } = useApp()
  const { member, isMember, barDismissed } = useSession()
  // scoped to the signed-in account — an eSIM belongs to whoever bought it
  const simCount = useOwnedSims(member?.email)
  const [discoverOpen, setDiscoverOpen] = useState(false)
  const discoverRef = useRef<HTMLSpanElement>(null)
  const initial = member ? member.name.trim()[0]?.toUpperCase() ?? 'P' : 'M'
  const location = useLocation()

  // close the Discover dropdown on navigation
  useEffect(() => {
    setDiscoverOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (discoverRef.current && !discoverRef.current.contains(e.target as Node)) {
        setDiscoverOpen(false)
      }
    }
    if (discoverOpen) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [discoverOpen])
  const overHero = location.pathname === '/' && !scrolled

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // tuck the bar away when reading; it returns the moment you scroll up.
      // Never hides while the Discover menu is open, and never before the
      // visitor is properly into the page.
      setHidden(y > lastY && y > 360 && !discoverOpen)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [discoverOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' is-active' : ''}`

  return (
    <header
      className={`nav${scrolled ? ' is-scrolled' : ''}${overHero ? ' is-over-hero' : ''}${hidden ? ' is-hidden' : ''}`}
    >
      <div className="nav-inner shell">
        <Link to="/" className="nav-logo" aria-label="PUNTA home">
          PUNTA
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/explore" end className={linkClass}>Explore</NavLink>
          <NavLink to="/explore?view=stays" className={linkClass}>Stays</NavLink>
          <span className="discover-root" ref={discoverRef}>
            <button
              type="button"
              className={`nav-link discover-btn${discoverOpen ? ' is-open' : ''}`}
              onClick={() => setDiscoverOpen(!discoverOpen)}
              aria-expanded={discoverOpen}
              aria-haspopup="menu"
            >
              Discover
            </button>
            {discoverOpen && (
              <span className="discover-menu" role="menu">
                <Link role="menuitem" to="/destinations" className="discover-item">Destination guides</Link>
                <Link role="menuitem" to="/experiences" className="discover-item">Experiences</Link>
                <Link role="menuitem" to="/dining" className="discover-item">Dining</Link>
                <Link role="menuitem" to="/transportation" className="discover-item">Transportation</Link>
                <Link role="menuitem" to="/map" className="discover-item">Map</Link>
                <Link role="menuitem" to="/esim" className="discover-item">eSIM</Link>
                <Link role="menuitem" to="/mytrip" className="discover-item discover-item--cta">My trip</Link>
              </span>
            )}
          </span>
          <NavLink to="/explore?view=destinations" className={linkClass}>Destinations</NavLink>
        </nav>

        <div className="nav-right">
          {!isMember && barDismissed && <SignInControl variant="nav" />}
          <RegionPicker />
          <Link to="/host" className="nav-host">Become a host</Link>
          <Link to="/wishlist" className="nav-heart" aria-label={`Wishlist, ${wishlist.length} saved`}>
            <IconHeart filled={wishlist.length > 0} />
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </Link>
          {simCount.owned > 0 && (
            <Link
              to="/esim"
              className={`nav-sim${simCount.active > 0 ? ' is-live' : ''}`}
              aria-label={
                `${simCount.owned} eSIM${simCount.owned === 1 ? '' : 's'}` +
                (simCount.ready > 0 ? `, ${simCount.ready} ready to activate` : '') +
                (simCount.active > 0 ? `, ${simCount.active} active` : '') +
                (simCount.expiring === 'out'
                  ? ', one runs out within a day'
                  : simCount.expiring === 'soon'
                    ? ', one runs out within two days'
                    : '')
              }
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3.5h8.5L19 8v12.5H6z" />
                <path d="M9.5 11.5h5v5h-5z" />
                <path d="M11 11.5v-2M13 11.5v-2" />
              </svg>
              {/* One signal at a time. The badge counts UNACTIVATED eSIMs —
                  the only state that needs a tap — and the dot appears only
                  when time is actually running out. A healthy active eSIM
                  shows neither: the tinted icon already says you're live. */}
              {simCount.ready > 0 && <span className="nav-badge">{simCount.ready}</span>}
              {simCount.expiring !== 'none' && (
                <span className={`nav-sim-dot is-${simCount.expiring}`} aria-hidden="true" />
              )}
            </Link>
          )}
          <Link to="/trips" className="nav-trips" aria-label={`Trips, ${trips.filter((t) => t.status === 'upcoming').length} active`}>
            Trips{trips.some((t) => t.status === 'upcoming') ? ` (${trips.filter((t) => t.status === 'upcoming').length})` : ''}
          </Link>
          <Link to="/mytrip" className="nav-trips" aria-label="My trip planner">
            My trip
          </Link>
          <Link
            to="/profile"
            className="nav-avatar"
            aria-label={member ? `Profile — ${member.name}` : 'Profile'}
          >
            <span aria-hidden="true">{initial}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
