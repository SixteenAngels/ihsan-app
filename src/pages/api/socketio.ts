import { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import ChatServer from '@/lib/chat-server'
import jwt from 'jsonwebtoken'

let io: SocketIOServer | null = null
let chatServer: ChatServer | null = null

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if socket exists and if io is already initialized
  if (!res.socket || (res.socket as any).server?.io) {
    console.log('Socket.IO already running or socket not available')
    res.end()
    return
  }

  console.log('Setting up Socket.IO server...')

  const httpServer: NetServer = (res.socket as any).server
  io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: (origin, callback) => {
        // Allow same-origin in production; allow localhost in development
        if (!origin) return callback(null, true)
        try {
          const url = new URL(origin)
          if (process.env.NODE_ENV !== 'production') {
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return callback(null, true)
          }
          // In production, only allow the deployment host
          const allowed = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).host : null
          if (allowed && url.host === allowed) return callback(null, true)
        } catch {}
        callback(new Error('Not allowed by CORS'))
      },
      methods: ['GET', 'POST']
    }
  })

  // Basic JWT auth middleware for Socket.IO (expects token in query)
  io.use((socket, next) => {
    const token = (socket.handshake.auth as any)?.token || (socket.handshake.query as any)?.token
    if (!token) return next()
    try {
      const decoded: any = jwt.decode(String(token))
      ;(socket as any).userId = decoded?.sub || decoded?.user?.id
    } catch {}
    next()
  })

  // Initialize chat server
  chatServer = new ChatServer(io)

  ;(res.socket as any).server.io = io
  res.end()
}

export { io, chatServer }
