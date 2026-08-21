export interface PresenceData {
  email: string
  [key: string]: any
}

export interface PresenceState {
  [key: string]: PresenceData[]
}
