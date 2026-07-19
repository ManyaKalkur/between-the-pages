import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import '../styles/auth.css'
import './RegisterPage.css'
import bookmark from "../../images/bookmark.jpg"

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
function EyeIcon({ open }) {
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

export default function RegisterPage() {
  const [form, setForm]= useState({ username:'', email:'', password:'', confirm:''})
  const [showPw,setShowPw]= useState(false)
  const [loading,setLoading]= useState(false)
  const [pwMatch,setPwMatch]= useState(true)
  const handle= e=> {
    const { name, value}= e.target
    setForm(f=> ({ ...f, [name]:value }))
    if (name=== 'confirm') setPwMatch(value===form.password ||value=== '')
    if (name=== 'password') setPwMatch(form.confirm=== value ||form.confirm=== '')
  }
  const submit= e=> {
    e.preventDefault()
    if (form.password !== form.confirm) { 
      setPwMatch(false); 
      return 
    }
    setLoading(true)
    setTimeout(()=> setLoading(false), 1200)
  }
  return (
    <>
      <Navbar/>
      <div className="auth-page rp-page">
        <div className="auth-page__form-col rp-form-col">
          <motion.div
            className="auth-form-box"
            initial={{ opacity:0,x:-28}}
            animate={{ opacity:1,x:0}}
            transition={{ duration:0.65,ease:EASE}}
          >
            <p className="eyebrow auth-eyebrow">Begin your story</p>
            <h1 className="auth-title">
              Join<br />
              <em className="rp-title-em">Between the Pages</em>
            </h1>
            <form onSubmit={submit} noValidate>
              <div className="auth-fields">
                <div className="field">
                  <label className="field__label" htmlFor="rp-username">Username</label>
                  <input
                    id="rp-username" type="text" name="username"
                    className="field__input"
                    placeholder="your_reader_name"
                    value={form.username} onChange={handle}
                    required autoComplete="username"
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="rp-email">Email address</label>
                  <input
                    id="rp-email" type="email" name="email"
                    className="field__input"
                    placeholder="you@example.com"
                    value={form.email} onChange={handle}
                    required autoComplete="email"
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="rp-pw">Password</label>
                  <div className="field__pw-wrap">
                    <input
                      id="rp-pw" name="password"
                      type={showPw ? 'text' :'password'}
                      className="field__input"
                      placeholder="Min. 8 characters"
                      value={form.password} onChange={handle}
                      required autoComplete="new-password"
                    />
                    <button type="button" className="field__pw-eye"
                      onClick={()=> setShowPw(v=> !v)}
                      aria-label={showPw ? 'Hide':'Show'}>
                      <EyeIcon open={showPw}/>
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="rp-confirm">Confirm password</label>
                  <input
                    id="rp-confirm" name="confirm"
                    type={showPw ? 'text':'password'}
                    className={`field__input ${!pwMatch ? 'field__input--error':''}`}
                    placeholder="••••••••"
                    value={form.confirm} onChange={handle}
                    required autoComplete="new-password"
                  />
                  {!pwMatch && <p className="field__error">Passwords don't match</p>}
                </div>
              </div>
              <button type="submit" className="btn btn--sage auth-submit" disabled={loading}>
                {loading?<span className="auth-spinner" />:'Create Account'}
              </button>
            </form>
            <div className="auth-divider">
              <span className="auth-divider__line" />
              <span className="auth-divider__text">or</span>
              <span className="auth-divider__line" />
            </div>
            <button type="button" className="btn btn--ghost auth-google">
              <GoogleIcon />
              Continue with Google
            </button>
            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch__link rp-switch-link">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
<div className="auth-page rp-page">
  <div className="auth-page__bmp rp-bmp">
    <img
      src={bookmark}
      alt="Bookmark"
      className="bookmark-image"
    />
  </div>
</div>
      </div>
    </>
  )
}
