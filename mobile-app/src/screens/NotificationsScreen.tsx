import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { useAuth } from '../lib/auth-context';

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsScreen() {
  const { userId } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const url = buildUrl(endpoints.notifications, { user_id: userId, limit: 50 });
      const res = await fetch(url);
      const json = await res.json();
      setItems(json.notifications || []);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch(endpoints.notifications, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mark_all_read: true }),
      });
      if (res.ok) fetchNotifications();
    } catch {}
  };

  useEffect(() => { fetchNotifications(); }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.markAll} onPress={markAllRead}>
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.title, !item.is_read && styles.unread]}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.meta}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        refreshing={loading}
        onRefresh={fetchNotifications}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  list: { padding: 16 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  unread: { color: '#007AFF' },
  message: { fontSize: 14, color: '#3A3A3C', marginTop: 4 },
  meta: { fontSize: 12, color: '#8E8E93', marginTop: 6 },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
  markAll: { padding: 12, alignItems: 'center' },
  markAllText: { color: '#007AFF', fontWeight: '600' },
});

