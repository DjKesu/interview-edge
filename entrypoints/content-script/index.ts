import { defineContentScript } from 'wxt/sandbox'
import type { Message, MessageResponse } from '../../src/types'

// Create and inject styles
const style = document.createElement('style')
style.textContent = `
  .interview-copilot-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 150px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    font-size: 14px;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  .interview-copilot-widget.visible {
    opacity: 1;
    transform: translateY(0);
  }
`

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Inject styles
    document.head.appendChild(style)

    // Create widget
    const widget = document.createElement('div')
    widget.className = 'interview-copilot-widget'
    widget.textContent = 'Interview mode started'
    document.body.appendChild(widget)

    console.log('Content script loaded')

    // Handle messages from background script
    chrome.runtime.onMessage.addListener((
      message: Message,
      sender,
      sendResponse: (response: MessageResponse) => void
    ) => {
      try {
        switch (message.action) {
          case 'TOGGLE_SIDEBAR':
            widget.classList.toggle('visible')
            sendResponse({ success: true })
            break

          default:
            sendResponse({
              success: false,
              error: `Unknown action: ${message.action}`
            })
        }
      } catch (error) {
        console.error('Error in content script:', error)
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })

    // Cleanup on navigation
    window.addEventListener('beforeunload', () => {
      widget.remove()
      style.remove()
    })
  }
})