import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../lib/auth-context';
import { API_BASE_URL } from '../lib/config';

type ChatMessage = { id: string; message: string; senderId: string; createdAt: string };

export default function ChatScreen() {
  const { userId } = useAuth();
  const [roomId, setRoomId] = useState<string>('public-support');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const token = undefined; // TODO: use Supabase session access_token if available
    const socket = io(API_BASE_URL, { path: '/api/socketio', transports: ['websocket'], auth: { token } });
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('authenticate', { userId, userRole: 'customer' });
    });
    socket.on('authenticated', () => {
      socket.emit('join_room', { roomId });
    });
    socket.on('new_message', (msg: any) => {
      setMessages(prev => [...prev, { id: msg.id, message: msg.message, senderId: msg.senderId, createdAt: msg.createdAt }]);
    });
    return () => { socket.disconnect(); };
  }, [userId, roomId]);

  const sendMessage = () => {
    if (!socketRef.current || !message) return;
    socketRef.current.emit('send_message', { roomId, message });
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.message}</Text>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  message: {
    padding: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
