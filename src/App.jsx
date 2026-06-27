import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BookCover from './components/BookCover'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrowsePage from './pages/BrowsePage'

function HomeWithIntro() {
  const [phase, setPhase] = useState('cover')
  useEffect(()=> {
    const t1= setTimeout(()=> setPhase('opening'),2000)
    const t2= setTimeout(()=> setPhase('open'),3600)
    return ()=> { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <>
      <WelcomePage revealed={phase==='open'} />
      {phase !== 'open' && <BookCover opening={phase==='opening'} />}
    </>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWithIntro/>}/>
        <Route path="/login"element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/books" element={<BrowsePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
