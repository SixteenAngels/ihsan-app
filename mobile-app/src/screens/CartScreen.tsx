import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { useAuth } from '../lib/auth-context';

type CartItem = {
  id: string;
  product_id: string;
  variant_id?: string | null;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartScreen() {
  const { userId } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const url = buildUrl(endpoints.cart, { userId });
      const res = await fetch(url);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e) {
      console.warn('Failed to load cart', e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (product_id: string, variant_id: string | null, quantity: number) => {
    try {
      const res = await fetch(endpoints.cart, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, variant_id, quantity, user_id: userId }),
      });
      if (res.ok) fetchCart();
    } catch {}
  };

  const removeItem = async (product_id: string, variant_id: string | null) => {
    try {
      const url = buildUrl(endpoints.cart, { product_id, variant_id: variant_id ?? '', user_id: userId });
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) fetchCart();
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.meta}>${item.price.toFixed(2)} · Qty {item.quantity}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.variant_id || null, Math.max(1, item.quantity - 1))}><Text style={styles.action}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.variant_id || null, item.quantity + 1)}><Text style={styles.action}>+</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item.product_id, item.variant_id || null)}><Text style={[styles.action, { color: '#FF3B30' }]}>Remove</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  list: { padding: 16 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  meta: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E5EA', backgroundColor: '#fff' },
  total: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
});

