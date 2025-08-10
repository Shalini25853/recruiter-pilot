import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

// Helpers
async function elevenTTS({ apiKey, voiceId, text }: { apiKey: string; voiceId: string; text: string }) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
  })
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`)
  const buf = await res.arrayBuffer()
  return new Blob([buf], { type: 'audio/mpeg' })
}

async function elevenSTT({ apiKey, fileBlob }: { apiKey: string; fileBlob: Blob }) {
  const form = new FormData()
  form.append('file', fileBlob, 'recording.webm')
  form.append('model_id', 'scribe_v1')
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  })
  if (!res.ok) throw new Error(`STT failed: ${res.status}`)
  return res.json() // { text: "..." }
}

export default function Assess() {
  // SEO
  useEffect(() => {
    document.title = 'Assess Candidates – Recruiter Pilot'
  }, [])

  // Recording state
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // Question prompt
  const [question, setQuestion] = useState<string>('Tell me about yourself.')
  const prompt = { body: question }

  // ElevenLabs state
  const [xiKey, setXiKey] = useState<string>(() => localStorage.getItem('xi_api_key') || '')
  const [voiceId, setVoiceId] = useState<string>(
    () => localStorage.getItem('xi_voice_id') || '21m00Tcm4TlvDq8ikWAM',
  )
  const [transcript, setTranscript] = useState<string>('')
  useEffect(() => {
    localStorage.setItem('xi_api_key', xiKey || '')
  }, [xiKey])
  useEffect(() => {
    localStorage.setItem('xi_voice_id', voiceId || '')
  }, [voiceId])

  // Actions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }
      mr.start()
      setRecording(true)
    } catch (e: any) {
      toast.error(e?.message || 'Microphone access failed')
    }
  }

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop()
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
      setRecording(false)
    } catch (e: any) {
      toast.error(e?.message || 'Stop failed')
    }
  }

  const speakQuestion = async () => {
    try {
      if (!xiKey) {
        toast.warning('Add your ElevenLabs API key.')
        return
      }
      const blob = await elevenTTS({ apiKey: xiKey, voiceId, text: prompt.body })
      new Audio(URL.createObjectURL(blob)).play()
    } catch (e: any) {
      toast.error(e.message || 'TTS error')
    }
  }

  const transcribeRecording = async () => {
    try {
      if (!xiKey) {
        toast.warning('Add your ElevenLabs API key.')
        return
      }
      if (!audioUrl) {
        toast.message('Record audio first.')
        return
      }
      const fileBlob = await (await fetch(audioUrl)).blob()
      const out = await elevenSTT({ apiKey: xiKey, fileBlob })
      setTranscript(out.text || '')
      toast.success('Transcribed with ElevenLabs.')
    } catch (e: any) {
      toast.error(e.message || 'STT error')
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Assess Candidates</h1>
        <p className="text-muted-foreground mt-1">Voice interview with TTS and transcription.</p>
      </header>

      <Card className="border">
        <CardHeader>
          <CardTitle>Question</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div>
            <Label htmlFor="q">Current question</Label>
            <input
              id="q"
              className="mt-2 w-full border rounded-md h-10 px-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ElevenLabs Settings */}
      <Card className="mt-6 border">
        <CardHeader><CardTitle>ElevenLabs Settings</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="xi">API Key</Label>
            <input id="xi" type="password" className="mt-2 w-full border rounded-md h-10 px-3"
              placeholder="xi-..." value={xiKey} onChange={(e)=>setXiKey(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Stored locally in your browser for this demo.</p>
          </div>
          <div>
            <Label htmlFor="voice">Voice ID</Label>
            <input id="voice" className="mt-2 w-full border rounded-md h-10 px-3"
              placeholder="e.g., 21m00Tcm4TlvDq8ikWAM" value={voiceId} onChange={(e)=>setVoiceId(e.target.value)} />
            <div className="mt-3">
              <Button variant="secondary" onClick={speakQuestion}>Speak current question</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Interview */}
      <Card className="border">
        <CardHeader>
          <CardTitle>Voice Interview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center gap-3">
            {!recording
              ? <Button onClick={startRecording}>Start recording</Button>
              : <Button variant="destructive" onClick={stopRecording}>Stop recording</Button>}
            {audioUrl && <audio src={audioUrl} controls className="ml-2" />}
            <Button variant="outline" onClick={transcribeRecording}>Transcribe with ElevenLabs</Button>
          </div>
          {transcript && (
            <div className="mt-3 text-sm">
              <div className="font-medium mb-1">Transcript</div>
              <div className="p-3 border rounded-md bg-muted/30 whitespace-pre-wrap">{transcript}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
