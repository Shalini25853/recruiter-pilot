import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mt-2">The page you’re looking for doesn’t exist.</p>
      <div className="mt-4">
        <Link to="/"><Button variant="secondary">Back to Home</Button></Link>
      </div>
    </section>
  )
}
