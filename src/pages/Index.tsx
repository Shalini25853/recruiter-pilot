import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Index() {
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
