export type NotificationMessage = {
  id: string
  title: string
  body: string
  createdAt: string
}

const messages: NotificationMessage[] = []

export function listNotifications(): NotificationMessage[] {
  return messages
}

export function addNotification(title: string, body: string): NotificationMessage {
  const msg = { id: String(messages.length + 1), title, body, createdAt: new Date().toISOString() }
  messages.unshift(msg)
  return msg
}


