
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';

type Message = {
  id: number;
  content: string;
  created_at?: string;
};

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!message) return;
    await supabase.from('messages').insert([{ content: message }]);
    setMessage('');
    fetchMessages();
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) || []);
  };

  React.useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <Text style={styles.message}>{item.content}</Text>
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
