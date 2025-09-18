import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { useAuth } from '../lib/auth-context';

type WishItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image?: string;
};

export default function WishlistScreen() {
  const { userId } = useAuth();
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const url = buildUrl(endpoints.wishlist, { userId });
      const res = await fetch(url);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e) {
      console.warn('Failed to load wishlist', e);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (product_id: string) => {
    try {
      const res = await fetch(endpoints.wishlist, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, user_id: userId }),
      });
      if (res.ok) fetchWishlist();
    } catch {}
  };

  useEffect(() => { fetchWishlist(); }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

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
              <Text style={styles.meta}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.product_id)}>
              <Text style={[styles.action, { color: '#FF3B30' }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Wishlist is empty</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  list: { padding: 16 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  meta: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  action: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});

