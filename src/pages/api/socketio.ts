import { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import ChatServer from '@/lib/chat-server'

let io: SocketIOServer | null = null
let chatServer: ChatServer | null = null

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log('Socket.IO already running')
    res.end()
    return
  }

  console.log('Setting up Socket.IO server...')

  const httpServer: NetServer = res.socket.server as any
  io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  // Initialize chat server
  chatServer = new ChatServer(io)

  res.socket.server.io = io
  res.end()
}

export { io, chatServer }
