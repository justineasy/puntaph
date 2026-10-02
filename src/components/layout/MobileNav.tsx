import { NavLink } from 'react-router-dom'
import { useApp } from '../../state/AppContext'
import { IconExplore, IconHeart, IconBag, IconUser } from '../system/Icons'
import './mobilenav.css'

export default function MobileNav() {
  const { wishlist } = useApp()

  return (
    <nav className="mnav" aria-label="Mobile">
      <NavLink to="/" end className={({ isActive }) => `mnav-item${isActive ? ' is-active' : ''}`}>
        <IconExplore />
        <span>Explore</span>
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => `mnav-item${isActive ? ' is-active' : ''}`}>
        <IconHeart filled={wishlist.length > 0} />
        <span>Wishlist</span>
      </NavLink>
      <NavLink to="/trips" className={({ isActive }) => `mnav-item${isActive ? ' is-active' : ''}`}>
        <IconBag />
        <span>Trips</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `mnav-item${isActive ? ' is-active' : ''}`}>
        <IconUser />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}
