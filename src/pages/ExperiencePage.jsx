import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { findExperience } from '../data/experienceData'
import './ExperiencePage.css'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

const STARS = Array.from({ length: 50 }, (_, i)=> ({
  id: i,
  x: ((i*37+13)%100),
  y: ((i*53+7)%100),
  size:((i*11)%3)+1,
  delay:((i*7)%30)/10,
  dur:((i*13)%20)/10+2.5,
}))
const PARTICLES= Array.from({length:28}, (_, i)=> ({
  id:i,
  x:((i*41+17)%100),
  y:((i*59+11)%100),
  size:((i*7)%2)+1,
  delay:((i*11)%40)/10,
  dur:((i*17)%30)/10+4,
}))
const sceneVariants= {
  enter:(dir)=> ({opacity:0, x:dir>0? 80: -80 }),
  center: {
    opacity:1,
    x:0,
    transition: {duration:0.55, ease: [0.4,0,0.2,1]},
  },
  exit:(dir)=> ({
    opacity: 0,
    x: dir>0? -80:80,
    transition: { duration:0.38, ease: [0.4,0,0.2,1]},
  }),
}
const textVariants= {
  hidden:{ opacity:0,y:22},
  visible:(d=0)=> ({
    opacity:1,y:0,
    transition: {delay:d, duration:0.65, ease:[0.4,0,0.2,1]},
  }),
}

function Stars({accent }) {
  return (
    <div className="exp-deco exp-deco--stars" aria-hidden="true">
      {STARS.map(s => (
        <span
          key={s.id}
          className="exp-star"
          style={{
            left:`${s.x}%`,
            top:`${s.y}%`,
            width:`${s.size}px`,
            height:`${s.size}px`,
            background:accent,
            animationDelay:`${s.delay}s`,
            animationDuration:`${s.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

function Particles({accent }) {
  return (
    <div className="exp-deco exp-deco--particles" aria-hidden="true">
      {PARTICLES.map(p=> (
        <span
          key={p.id}
          className="exp-particle"
          style={{
            left:`${p.x}%`,
            top:`${p.y}%`,
            width:`${p.size}px`,
            height:`${p.size}px`,
            background:accent,
            animationDelay:`${p.delay}s`,
            animationDuration:`${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

function Lightning({accent }) {
  return (
    <div className="exp-deco exp-deco--lightning" aria-hidden="true">
      <span className="exp-lightning" style={{color:accent}}></span>
    </div>
  )
}

function Decoration({ type, accent}) {
  if (type=== 'stars') return <Stars accent={accent}/>
  if (type==='particles') return <Particles accent={accent}/>
  if (type=== 'lightning') return <Lightning accent={accent}/>
  return null
}

function TitleScene({ scene }) {
  return (
    <div className="exp-scene__body exp-scene__body--title">
      {scene.eyebrow && (
        <motion.p className="exp-eyebrow" custom={0.1} variants={textVariants} initial="hidden" animate="visible">
          {scene.eyebrow}
        </motion.p>
      )}
      <motion.h1
        className="exp-title"
        style={{ '--accent': scene.accent }}
        custom={0.3} variants={textVariants} initial="hidden" animate="visible">
        {scene.headline}
      </motion.h1>
      {scene.subheadline && (
        <motion.p className="exp-subtitle" custom={0.55} variants={textVariants} initial="hidden" animate="visible">
          {scene.subheadline}
        </motion.p>
      )}
    </div>
  )
}

function AtmosphereScene({ scene }) {
  return (
    <div className="exp-scene__body exp-scene__body--atmosphere">
      {scene.eyebrow && (
        <motion.p
          className="exp-eyebrow"
          style={{ color: scene.accent }}
          custom={0.1} variants={textVariants} initial="hidden" animate="visible">
          {scene.eyebrow}
        </motion.p>
      )}
      <motion.h2
        className="exp-atm-headline"
        custom={0.3} variants={textVariants} initial="hidden" animate="visible">
        {scene.headline}
      </motion.h2>
      {scene.body && (
        <motion.p
          className="exp-atm-body"
          custom={0.55} variants={textVariants} initial="hidden" animate="visible">
          {scene.body}
        </motion.p>
      )}
    </div>
  )
}

function QuoteScene({ scene }) {
  return (
    <div className="exp-scene__body exp-scene__body--quote">
      <motion.span
        className="exp-quote-mark"
        style={{ color: scene.accent }}
        custom={0.0} variants={textVariants} initial="hidden" animate="visible"
        aria-hidden="true">
        "
      </motion.span>
      <motion.blockquote
        className="exp-quote-text"
        custom={0.25} variants={textVariants} initial="hidden" animate="visible">
        {scene.quote}
      </motion.blockquote>
      {scene.attribution && (
        <motion.footer
          className="exp-quote-attr"
          custom={0.55} variants={textVariants} initial="hidden" animate="visible">
          {scene.attribution}
        </motion.footer>
      )}
    </div>
  )
}

function RevealScene({ scene }) {
  return (
    <div className="exp-scene__body exp-scene__body--reveal">
      <motion.p
        className="exp-reveal-text"
        style={{'--accent': scene.accent }}
        custom={0.2} variants={textVariants} initial="hidden" animate="visible">
        {scene.headline}
      </motion.p>
    </div>
  )
}

function EndScene({ scene, book, bookId }) {
  return (
    <div className="exp-scene__body exp-scene__body--end">
      {book?.cover && (
        <motion.img
          src={book.cover}
          alt={book.title}
          className="exp-end-cover"
          custom={0.0} variants={textVariants} initial="hidden" animate="visible"/>
      )}
      <motion.h2
        className="exp-end-title"
        custom={0.2} variants={textVariants} initial="hidden" animate="visible">
        {book?.title??'The Story Awaits'}
      </motion.h2>
      {book?.author && (
        <motion.p
          className="exp-end-author"
          custom={0.35} variants={textVariants} initial="hidden" animate="visible">
          by {book.author}
        </motion.p>
      )}
      <motion.div
        className="exp-end-rule"
        style={{ background: scene.accent }}
        custom={0.5} variants={textVariants} initial="hidden" animate="visible"/>
      <motion.div
        className="exp-end-actions"
        custom={0.65} variants={textVariants} initial="hidden" animate="visible">
        <Link
          to={`/books/${bookId}`}
          className="btn exp-end-cta"
          style={{ background: scene.accent, borderColor: scene.accent, color: '#14100F'}}>
          Continue to Book
        </Link>
        <Link to="/books" className="exp-end-browse">
          Browse more books
        </Link>
      </motion.div>
    </div>
  )
}

export default function ExperiencePage() {
  const { id }= useParams()
  const navigate= useNavigate()
  const [book,setBook]= useState(null)
  const [experience,setExperience]= useState(null)
  const [loading,setLoading]= useState(true)
  const [scene,setScene]= useState(0)
  const [direction,setDirection]= useState(1)

  useEffect(()=> {
    const run= async ()=> {
      try {
        const qs= API_KEY? `?key=${API_KEY}`: ''
        const res= await fetch(`https://www.googleapis.com/books/v1/volumes/${id}${qs}`)
        const data= await res.json()
        const info= data.volumeInfo ?? {}
        const b= {
          title:info.title ?? '',
          author:info.authors?.[0] ?? '',
          cover:info.imageLinks?.thumbnail?.replace('http:', 'https:')?? null,
          description: info.description ?? '',
        }
        setBook(b)
        setExperience(findExperience(b.title, b))
      } catch {
        setExperience(findExperience('', {}))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  useEffect(() => {
    document.body.style.overflow= 'hidden'
    return () => { document.body.style.overflow= '' }
  }, [])

  const total= experience?.scenes.length ?? 0
  const isLast= scene === total-1
  const next= useCallback(()=> {
    if (isLast) return
    setDirection(1)
    setScene(s=> s+1)
  }, [isLast])
  const prev= useCallback(()=> {
    if (scene=== 0) return
    setDirection(-1)
    setScene(s=> s-1)
  }, [scene])

  useEffect(()=> {
    const handler= (e)=> {
      if (e.key=== 'ArrowRight'|| e.key === ' ') { e.preventDefault(); next()}
      if (e.key=== 'ArrowLeft') {e.preventDefault(); prev()}
      if (e.key=== 'Escape') navigate(`/books/${id}`)
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  }, [next, prev, navigate, id])

  if (loading) return (
    <div className="exp exp--loading">
      <div className="exp-loader"/>
    </div>
  )

  if (!experience) return null
  const currentScene= experience.scenes[scene]

  return (
    <div
      className="exp"
      onClick={!isLast ? next: undefined}
      role="presentation">
      <Link
        to={`/books/${id}`}
        className="exp__skip"
        onClick={e => e.stopPropagation()}
        aria-label="Skip experience">
        Skip
      </Link>
      <div className="exp__progress" onClick={e=> e.stopPropagation()}>
        {experience.scenes.map((_, i)=> (
          <button
            key={i}
            className={`exp__dot ${i=== scene? 'exp__dot--on':i< scene? 'exp__dot--past':''}`}
            style={i=== scene? {background: currentScene.accent, borderColor:currentScene.accent }:{}}
            onClick={()=> { setDirection(i>scene? 1:-1); setScene(i)}}
            aria-label={`Go to scene ${i+1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={scene}
          className="exp__scene"
          style={{ background: currentScene.bg}}
          custom={direction}
          variants={sceneVariants}
          initial="enter"
          animate="center"
          exit="exit">
          <Decoration type={currentScene.decoration} accent={currentScene.accent}/>
          {currentScene.type=== 'title' && <TitleScene scene={currentScene}/>}
          {currentScene.type=== 'atmosphere' && <AtmosphereScene scene={currentScene}/>}
          {currentScene.type=== 'quote'&& <QuoteScene scene={currentScene}/>}
          {currentScene.type=== 'reveal'&& <RevealScene scene={currentScene}/>}
          {currentScene.type=== 'end'&& (<EndScene scene={currentScene} book={book} bookId={id} />)}
          {!isLast && (
            <button
              className="exp__next"
              style={{color: currentScene.accent, borderColor:`${currentScene.accent}55`}}
              onClick={e=> { e.stopPropagation(); next() }}
              aria-label="Next scene">
              Next
            </button>
          )}
        </motion.div>
      </AnimatePresence>
      {!isLast && (
        <p className="exp__hint" aria-hidden="true">
          Click anywhere/Space
        </p>
      )}
    </div>
  )
}