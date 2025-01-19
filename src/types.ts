// Message types for communication between components
export type MessageAction = 
  | 'GET_CURRENT_TAB'
  | 'START_RECORDING'
  | 'STOP_RECORDING'
  | 'TOGGLE_SIDEBAR'

export interface Message {
  action: MessageAction
  payload?: any
}

export interface MessageResponse {
  success: boolean
  data?: any
  error?: string
} 