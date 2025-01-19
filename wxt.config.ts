import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Interview Copilot',
    description: 'AI-powered interview assistant with Picture-in-Picture support',
    version: '1.0.0',
    permissions: [
      'activeTab',
      'scripting',
      'storage'
    ],
    host_permissions: ['<all_urls>'],
    // Allow our copilot UI to be loaded in the PiP window
    web_accessible_resources: [{
      resources: ['copilot/*', 'content/*'],
      matches: ['<all_urls>']
    }]
  }
})