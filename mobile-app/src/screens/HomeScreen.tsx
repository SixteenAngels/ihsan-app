import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { endpoints } from '../lib/config';

type Homepage = { banners: string[]; featuredProductIds: string[]; discountsNote?: string };
type Product = { id: string; name: string; price: number; image?: string | null };

export default function HomeScreen() {
  const [data, setData] = useState<Homepage | null>(null);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(endpoints.homepage);
        const hp: Homepage = await res.json();
        setData(hp);
        if (hp.featuredProductIds?.length) {
          const ids = hp.featuredProductIds.slice(0, 8);
          const results: Product[] = [];
          for (const id of ids) {
            try {
              const pr = await fetch(endpoints.productDetail(id));
              const pj = await pr.json();
              const p = pj?.data;
              if (p) results.push({ id: p.id, name: p.name, price: p.price, image: Array.isArray(p.images) ? p.images[0] : null });
            } catch {}
          }
          setFeatured(results);
        } else {
          const pr = await fetch(`${endpoints.products}?limit=8`);
          const pj = await pr.json();
          setFeatured((pj.products || []).map((p: any) => ({ id: p.id, name: p.name, price: p.price, image: p.image })));
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            {data?.banners?.length ? (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data.banners}
                keyExtractor={(u) => u}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.banner} />
                )}
              />
            ) : null}
            {data?.discountsNote ? <Text style={styles.note}>{data.discountsNote}</Text> : null}
            <Text style={styles.section}>Featured</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        data={featured}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={[styles.image, { backgroundColor: '#eee' }]} />}
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  list: { padding: 16 },
  banner: { width: Dimensions.get('window').width - 32, height: 140, borderRadius: 12, marginRight: 12 },
  note: { color: '#3A3A3C', marginTop: 12 },
  section: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginVertical: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12, flexDirection: 'row' },
  image: { width: 96, height: 96 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  price: { fontSize: 15, fontWeight: '600', color: '#007AFF', marginTop: 6 },
});

