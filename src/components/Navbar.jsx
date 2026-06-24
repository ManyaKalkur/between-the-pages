import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`nav ${scrolled ?'nav--scrolled' :''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          Between <em>the Pages</em>
        </Link>
        <nav className={`nav__links ${menuOpen ? 'nav__links--open' :''}`} aria-label="Main navigation">
          <NavLink to="/books" className={({ isActive }) => isActive ? 'active' :''}>Browse</NavLink>
          <NavLink to="/experiences" className={({ isActive }) => isActive ? 'active' :''}>Experiences</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' :''}>About</NavLink>
        </nav>
        <div className="nav__auth">
          <Link to="/login" className="nav__signin">Log in</Link>
          <Link to="/register" className="btn btn--sage nav__join">Get Started</Link>
        </div>
        <button
          className={`nav__burger ${menuOpen ? 'nav__burger--open' :''}`}
          onClick={()=> setMenuOpen(v=> !v)}
          aria-label={menuOpen ? 'Close menu' :'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
