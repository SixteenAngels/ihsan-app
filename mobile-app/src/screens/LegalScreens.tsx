import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.body}>We value your privacy. This is a placeholder. Replace with your policy.</Text>
    </ScrollView>
  );
}

export function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.body}>Your use of this app constitutes agreement to these terms. Replace with your terms.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  body: { fontSize: 14, color: '#3A3A3C', lineHeight: 20 },
});

