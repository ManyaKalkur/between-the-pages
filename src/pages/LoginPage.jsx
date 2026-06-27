import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import '../styles/auth.css'
import './LoginPage.css'

const EASE = [0.4, 0, 0.2, 1]
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.332C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
function EyeIcon({ open}) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default function LoginPage() {
  const [form,setForm]= useState({ email: '',password: ''})
  const [showPw,setShowPw]= useState(false)
  const [loading,setLoading]= useState(false)
  const handle= e=> setForm(f=> ({ ...f, [e.target.name]: e.target.value}))
  const submit= e=> {
    e.preventDefault()
    setLoading(true)
    setTimeout(()=> setLoading(false), 1200)
  }
  return (
    <>
      <Navbar />
      <div className="auth-page lp-page">
        <div className="auth-page__bmp lp-bmp">
          <img
            src="../images/bookmark.jpg"
            alt="Bookmark"
            className="bookmark-image"
          />
        </div>
        <div className="auth-page__form-col lp-form-col">
          <motion.div
            className="auth-form-box"
            initial={{ opacity:0,x:28 }}
            animate={{ opacity:1,x:0 }}
            transition={{ duration:0.65, ease:EASE }}
          >
            <p className="eyebrow auth-eyebrow">Dive back into the Stories</p>
            <h1 className="auth-title">
              Sign in to<br />
              <em className="lp-title-em">Between the Pages</em>
            </h1>
            <form onSubmit={submit} noValidate>
              <div className="auth-fields">
                <div className="field">
                  <label className="field__label" htmlFor="lp-email">Email address</label>
                  <input
                    id="lp-email" type="email" name="email"
                    className="field__input"
                    placeholder="you@example.com"
                    value={form.email} onChange={handle}
                    required autoComplete="email"
                  />
                </div>
                <div className="field">
                  <div className="field__label-row">
                    <label className="field__label" htmlFor="lp-pw">Password</label>
                    <Link to="/forgot-password" className="field__forgot">Forgot?</Link>
                  </div>
                  <div className="field__pw-wrap">
                    <input
                      id="lp-pw" name="password"
                      type={showPw? 'text':'password'}
                      className="field__input"
                      placeholder="••••••••"
                      value={form.password} onChange={handle}
                      required autoComplete="current-password"
                    />
                    <button type="button" className="field__pw-eye"
                      onClick={() => setShowPw(v => !v)}
                      aria-label={showPw? 'Hide password':'Show password'}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn--sage auth-submit" disabled={loading}>
                {loading ?<span className="auth-spinner"/> :'Sign In'}
              </button>
            </form>
            <div className="auth-divider">
              <span className="auth-divider__line"/>
              <span className="auth-divider__text">or</span>
              <span className="auth-divider__line"/>
            </div>
            <button type="button" className="btn btn--ghost auth-google">
              <GoogleIcon />
              Continue with Google
            </button>
            <p className="auth-switch">
              New here?{' '}
              <Link to="/register" className="auth-switch__link lp-switch-link">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
