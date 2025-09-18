import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { useNavigation } from '@react-navigation/native';

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
};

export default function OrdersScreen({ route }: any) {
  const { userId } = route.params || {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = buildUrl(endpoints.orders, { customerId: userId, limit: 20 });
        const res = await fetch(url);
        const json = await res.json();
        setOrders(json.orders || []);
      } catch (e) {
        console.warn('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetail', { orderNumber: item.order_number })}>
            <Text style={styles.title}>Order {item.order_number}</Text>
            <Text style={styles.meta}>{new Date(item.created_at).toLocaleString()} · {item.status}</Text>
            <Text style={styles.total}>${item.total_amount?.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
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
  total: { fontSize: 15, color: '#007AFF', marginTop: 6, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});

