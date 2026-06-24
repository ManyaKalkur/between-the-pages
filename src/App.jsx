import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BookCover from './components/BookCover'
import WelcomePage from './pages/WelcomePage'

export default function App() {
  const [phase, setPhase] = useState('cover')

  useEffect(()=> {
    const t1= setTimeout(()=> setPhase('opening'),2000)
    const t2= setTimeout(()=> setPhase('open'),3600)
    return ()=> { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <BrowserRouter>
      <WelcomePage revealed={phase=== 'open'}/>
      {phase !== 'open' &&(
        <BookCover opening={phase=== 'opening'}/>
      )}
    </BrowserRouter>
  )
}
