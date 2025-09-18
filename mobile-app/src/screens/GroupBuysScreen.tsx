import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { Button, Alert } from 'react-native';
import { useAuth } from '../lib/auth-context';

type GroupBuy = {
  id: string;
  name: string;
  description?: string | null;
  products?: { name: string; images?: string[] };
  start_date: string;
  end_date: string;
};

export default function GroupBuysScreen() {
  const { userId } = useAuth();
  const [rows, setRows] = useState<GroupBuy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const url = buildUrl(endpoints.groupBuys, { limit: 20 });
        const res = await fetch(url);
        const json = await res.json();
        setRows(json.data || []);
      } catch (e) {
        console.warn('Failed to load group buys', e);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupBuys();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            {item.description ? <Text style={styles.meta}>{item.description}</Text> : null}
            <Text style={styles.meta}>Ends {new Date(item.end_date).toLocaleString()}</Text>
            <View style={{ marginTop: 8 }}>
              <Button title="Join" onPress={async () => {
                try {
                  const res = await fetch(endpoints.groupBuyJoin(item.id), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, quantity: 1 }),
                  });
                  const json = await res.json();
                  if (!json?.success) throw new Error(json?.error || 'Failed');
                  Alert.alert('Joined', 'You joined the group buy');
                } catch (e: any) {
                  Alert.alert('Error', e.message || 'Failed to join');
                }
              }} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No active group buys</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  meta: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});

