import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { endpoints } from '../lib/config';

type OrderItem = {
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  image?: string;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
};

export default function OrderDetailScreen({ route }: any) {
  const { orderNumber } = route.params || {};
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(endpoints.orderDetail(orderNumber));
        const json = await res.json();
        setOrder(json.order || null);
      } catch (e) {
        console.warn('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    };
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  if (!order) return <View style={styles.container}><Text style={styles.empty}>Order not found</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order {order.order_number}</Text>
      <Text style={styles.meta}>{order.status}</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={order.items}
        keyExtractor={(item, idx) => `${item.product_id}-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>{item.product_name}</Text>
            <Text style={styles.meta}>Qty {item.quantity}</Text>
            <Text style={styles.price}>${item.unit_price.toFixed(2)}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${order.total_amount?.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  list: { paddingTop: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  meta: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  price: { fontSize: 15, color: '#007AFF', marginTop: 4, fontWeight: '600' },
  total: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginTop: 12 },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});

