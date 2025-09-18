import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';

type UiProduct = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  category?: string;
  stock?: number;
  image?: string | null;
};

export default function ProductsScreen() {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = buildUrl(endpoints.products, { limit: 20 });
        const res = await fetch(url);
        const json = await res.json();
        setProducts(json.products || []);
      } catch (e) {
        console.warn('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]} />
            )}
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.meta}>{item.brand || ''} {item.category ? `· ${item.category}` : ''}</Text>
              <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
  },
  image: {
    width: 96,
    height: 96,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  meta: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 6,
  },
});

