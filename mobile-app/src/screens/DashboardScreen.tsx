

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

type Order = {
  id: number;
  created_at: string;
  status: string;
};

export default function DashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item: Order) => item.id?.toString()}
        renderItem={({ item }: { item: Order }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{item.created_at}</Text>
            <Text style={styles.orderStatus}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Apple system background
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E', // Apple label color
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#007AFF', // Apple blue
  },
  orderDate: {
    fontSize: 14,
    color: '#8E8E93', // Apple secondary label
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 16,
    color: '#34C759', // Apple green for success
    marginTop: 8,
    fontWeight: '500',
  },
});
