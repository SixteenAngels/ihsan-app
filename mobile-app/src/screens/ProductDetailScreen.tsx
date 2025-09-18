import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Button, Alert } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { Alert, Button } from 'react-native';

type Variant = { id: string; name: string; price: number };
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  product_variants?: Variant[];
};

export default function ProductDetailScreen({ route }: any) {
  const { id, userId } = route.params || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = endpoints.productDetail(id);
        const res = await fetch(url);
        const json = await res.json();
        setProduct(json?.data || null);
      } catch (e) {
        console.warn('Failed to load product', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product?.id || !userId) {
      Alert.alert('Error', 'Missing product or user.');
      return;
    }
    try {
      const res = await fetch(endpoints.cart, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, user_id: userId, quantity: 1 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to add to cart');
      Alert.alert('Added', 'Item added to cart');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add to cart');
    }
  };

  const markReviewHelpful = async (reviewId: string) => {
    try {
      const res = await fetch(endpoints.reviewsHelpful(reviewId), { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      Alert.alert('Thanks!', 'Marked as helpful.');
    } catch {}
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  if (!product) return <View style={styles.container}><Text style={styles.error}>Product not found</Text></View>;

  const hero = product.images?.[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {hero ? <Image source={{ uri: hero }} style={styles.hero} /> : <View style={[styles.hero, { backgroundColor: '#eee' }]} />}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
        {product.description ? <Text style={styles.desc}>{product.description}</Text> : null}
        <View style={styles.cta}>
          <Button title="Add to Cart" color="#007AFF" onPress={addToCart} />
        </View>
        {Array.isArray((product as any).reviews) && (product as any).reviews.length ? (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.section}>Reviews</Text>
            {(product as any).reviews.map((r: any) => (
              <View key={r.id} style={styles.review}>
                <Text style={styles.reviewTitle}>{r.title || 'Review'}</Text>
                <Text style={styles.reviewBody}>{r.comment || ''}</Text>
                <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  <Button title="Helpful" onPress={() => markReviewHelpful(r.id)} />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  hero: { width: '100%', height: 280 },
  content: { padding: 16, backgroundColor: '#fff', marginTop: -16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E' },
  price: { fontSize: 18, fontWeight: '600', color: '#007AFF', marginTop: 6 },
  desc: { fontSize: 15, color: '#3A3A3C', marginTop: 12, lineHeight: 20 },
  cta: { marginTop: 16, borderRadius: 12, overflow: 'hidden' },
  error: { padding: 16, color: '#8E8E93' },
});

