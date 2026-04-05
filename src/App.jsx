import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Writings from './pages/Writings'
import WritingDetail from './pages/WritingDetail'
import Features from './pages/Features'

export default function App() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
  }, [light])

  return (
    <BrowserRouter>
      <div className={light ? 'min-h-screen bg-[#f9f9f7]' : 'min-h-screen bg-[#0c0c0c]'}>
        <Header light={light} onToggleLight={() => setLight(l => !l)} />
        <Routes>
          <Route path="/" element={<Home light={light} />} />
          <Route path="/projects" element={<Projects light={light} />} />
          <Route path="/projects/:slug" element={<ProjectDetail light={light} />} />
          <Route path="/writings" element={<Writings light={light} />} />
          <Route path="/writings/:slug" element={<WritingDetail light={light} />} />
          <Route path="/features" element={<Features light={light} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
