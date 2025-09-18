import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Linking } from 'react-native';
import { endpoints } from '../lib/config';

export default function CheckoutScreen({ route }: any) {
  const { userId, amount, email, phone, orderNumber } = route.params || {};
  const [processing, setProcessing] = useState(false);

  const pay = async () => {
    try {
      setProcessing(true);
      const reference = orderNumber || `MOB-${Date.now()}`;
      const res = await fetch(endpoints.paystackInitialize, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round((amount || 0) * 100),
          email,
          reference,
          callback_url: `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/payment/callback`,
          metadata: { user_id: userId, order_number: reference },
        }),
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || 'Failed to initialize payment');
      const url = json.data.authorization_url;
      await Linking.openURL(url);
    } catch (e: any) {
      Alert.alert('Payment error', e.message || 'Could not start payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.meta}>Amount: ${Number(amount || 0).toFixed(2)}</Text>
      <Text style={styles.meta}>Email: {email}</Text>
      <View style={styles.cta}>
        <Button title={processing ? 'Processing…' : 'Pay with Paystack'} disabled={processing} color="#007AFF" onPress={pay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  meta: { fontSize: 14, color: '#3A3A3C', marginTop: 8 },
  cta: { marginTop: 16, borderRadius: 12, overflow: 'hidden' },
});

