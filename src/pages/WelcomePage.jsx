import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import './WelcomePage.css'
const PARTICLES = [
  { w: 56, h: 74, top:'12%',left:'6%',rot:'-13deg',delay:0,dur: '9s'},
  { w: 36, h: 50, top:'70%',left:'5%',rot:'8deg',delay: 2.5,dur: '11s'},
  { w: 68, h: 90, top:'16%',left:'88%',rot:'15deg',delay:1,dur:'10s'},
  { w: 42, h: 56, top:'72%',left:'87%', rot:'-10deg',delay:3,dur:'8s'},
  { w: 30, h: 44, top:'42%',left:'2%', rot:'22deg',delay:4,dur:'12s'},
  { w: 48, h: 64,top:'36%',left:'93%', rot:'-20deg',delay: 1.5,dur:'9.5s'},
]
const EASE = [0.4, 0, 0.2, 1]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.75, ease: EASE },
})

export default function WelcomePage({ revealed }) {
  return (
    <div className="wp">
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="navbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      <section className="wp__hero" aria-label="Welcome">
        <div className="wp__glow wp__glow--a" aria-hidden="true" />
        <div className="wp__glow wp__glow--b" aria-hidden="true" />
        <div className="wp__glow wp__glow--c" aria-hidden="true" />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="wp__particle"
            aria-hidden="true"
            style={{
              width: p.w,
              height:p.h,
              top: p.top,
              left:p.left,
              '--rot':p.rot,
              '--dur':p.dur,
              animationDelay: `${p.delay}s`,
              opacity: revealed ? undefined : 0,
            }}
          />
        ))}
        {revealed && (
          <motion.div
            className="wp__reveal-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            aria-hidden="true"
          />
        )}
        <div className="wp__content">
          {revealed && (
            <>
              <motion.h1 className="wp__title" {...fadeUp(0.3)}>
                Between
                <br />
                <em>the Pages</em>
              </motion.h1>

              <motion.p className="wp__subtitle" {...fadeUp(0.55)}>
                Every book is a world. Step inside.
              </motion.p>
              <motion.div className="wp__auth-group" {...fadeUp(0.75)}>
                <Link to="/register" className="btn btn--sage wp__btn-primary">
                  Create Account
                </Link>
                <Link to="/login" className="btn btn--outline wp__btn-secondary">
                  Sign In
                </Link>
              </motion.div>
              <motion.div className="wp__divider" {...fadeUp(0.95)}>
                <span className="wp__divider-line" />
                <span className="wp__divider-text">or</span>
                <span className="wp__divider-line" />
              </motion.div>
              <motion.div {...fadeUp(1.05)}>
                <Link to="/books" className="wp__guest-link">
                  Continue browsing without an account
                  <span className="wp__guest-arrow" aria-hidden="true"> →</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
        
        {revealed && (
          <motion.div
            className="wp__scroll-cue"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <div className="wp__scroll-line" />
          </motion.div>
        )}
      </section>
    </div>
  )
}
