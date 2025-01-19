import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function Popup() {
  const startCopilot = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) return

    // Inject the PiP script into the current tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script/index.js']
    })

    window.close()
  }

  return (
    <div className="w-64 p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Interview Copilot</h1>
        <p className="text-sm text-gray-600">Your AI interview assistant</p>
      </div>
      
      <button
        onClick={startCopilot}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Start Interview Mode
      </button>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<Popup />)