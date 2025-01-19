import React, { useState, useEffect, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

// Types
interface TranscriptEntry {
  time: string
  text: string
  speaker: 'interviewer' | 'candidate'
}

interface Suggestion {
  id: string
  text: string
  completed: boolean
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          <h2>Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function CopilotUI() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  // Initialize and load data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        // Simulate loading initial data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setTranscript([
          {
            time: '08:42',
            text: 'Could you explain your experience with distributed systems?',
            speaker: 'interviewer'
          },
          {
            time: '08:43',
            text: 'I\'ve worked extensively with microservices architecture...',
            speaker: 'candidate'
          }
        ])

        setSuggestions([
          { id: '1', text: 'Mention specific examples of scaling challenges', completed: false },
          { id: '2', text: 'Discuss monitoring and observability', completed: false },
          { id: '3', text: 'Architecture patterns covered', completed: true }
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const toggleRecording = useCallback(async () => {
    try {
      const action = isRecording ? 'STOP_RECORDING' : 'START_RECORDING'
      const response = await chrome.runtime.sendMessage({ action })
      
      if (response.success) {
        setIsRecording(!isRecording)
      } else {
        throw new Error(response.error || 'Failed to toggle recording')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle recording')
    }
  }, [isRecording])

  if (isLoading) {
    return (
      <div className="h-screen bg-white p-3 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-white p-3">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white p-3 text-sm" role="application" aria-label="Interview Copilot">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-semibold">Interview Copilot</h1>
        <button
          onClick={toggleRecording}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-600">
            {isRecording ? 'Recording' : 'Start'}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-2 h-[calc(100%-2rem)]">
        {/* Transcript Panel */}
        <section
          className="bg-gray-50 rounded-lg p-2 overflow-y-auto"
          aria-label="Interview transcript"
        >
          {transcript.map((entry, i) => (
            <div
              key={i}
              className={`mb-2 ${
                entry.speaker === 'interviewer' ? 'pl-2 border-l-2 border-blue-400' : ''
              }`}
            >
              <div className="text-xs text-gray-500">{entry.time}</div>
              <div className="text-xs">{entry.text}</div>
            </div>
          ))}
        </section>

        {/* Suggestions Panel */}
        <section
          className="bg-blue-50 rounded-lg p-2 overflow-y-auto"
          aria-label="Interview suggestions"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white rounded p-2 mb-2 text-xs flex items-start gap-2"
            >
              {suggestion.completed && (
                <span className="text-green-500 flex-shrink-0" aria-label="Completed">
                  ✓
                </span>
              )}
              <span>{suggestion.text}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

// Mount app with error boundary
const root = createRoot(document.getElementById('app')!)
root.render(
  <ErrorBoundary>
    <CopilotUI />
  </ErrorBoundary>
)