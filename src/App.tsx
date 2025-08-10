import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Index from './pages/Index'
import Recruiter from './pages/Recruiter'
import Assess from './pages/Assess'
import NotFound from './pages/NotFound'
import { Button } from '@/components/ui/button'

export function App() {
  return (
    <HashRouter>
      <header className="border-b">
        <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Recruiter Pilot</Link>
          <div className="flex items-center gap-3">
            <Link to="/assess"><Button variant="secondary">Assess</Button></Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="/assess" element={<Assess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </HashRouter>
  )
}

