import { defineBackground } from 'wxt/sandbox'
import type { Message, MessageResponse } from '../src/types'

export default defineBackground({
  main() {
    // Listen for installation
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Interview Copilot installed!')
    })

    // Handle messages from popup/content script
    chrome.runtime.onMessage.addListener((
      message: Message,
      sender,
      sendResponse: (response: MessageResponse) => void
    ) => {
      try {
        switch (message.action) {
          case 'GET_CURRENT_TAB':
            chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
              if (!tab?.id) {
                sendResponse({ success: false, error: 'No active tab found' })
                return
              }
              sendResponse({ success: true, data: { tabId: tab.id } })
            })
            return true // Keep message channel open for async response

          case 'START_RECORDING':
            // TODO: Implement recording logic
            chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
              if (!tab?.id) {
                sendResponse({ success: false, error: 'No active tab found' })
                return
              }
              // Show sidebar if not visible
              await chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_SIDEBAR' })
              sendResponse({ success: true })
            })
            return true

          case 'STOP_RECORDING':
            // TODO: Implement stop recording logic
            sendResponse({ success: true })
            break

          default:
            sendResponse({
              success: false,
              error: `Unknown action: ${message.action}`
            })
        }
      } catch (error) {
        console.error('Error in message handler:', error)
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })
  }
})