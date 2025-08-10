import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Assess from '@/pages/Assess'
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
          <Route path="/" element={<Home />} />
          <Route path="/assess" element={<Assess />} />
        </Routes>
      </main>
    </HashRouter>
  )
}

function Home() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Candidate Assessment</h1>
      <p className="text-muted-foreground mt-2">Use the Assess page to try voice interview, TTS and transcription.</p>
      <div className="mt-4">
        <Link to="/assess"><Button>Go to Assess</Button></Link>
      </div>
    </section>
  )
}
