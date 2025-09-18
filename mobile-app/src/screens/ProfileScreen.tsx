import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { endpoints, buildUrl } from '../lib/config';
import { useAuth } from '../lib/auth-context';

type Profile = {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string;
};

export default function ProfileScreen() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = buildUrl(endpoints.users, { id: userId });
        const res = await fetch(url);
        const json = await res.json();
        setProfile(json || null);
      } catch (e) {
        console.warn('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  if (!profile) return <View style={styles.container}><Text style={styles.empty}>Profile not found</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.full_name || 'Customer'}</Text>
      <Text style={styles.meta}>{profile.email}</Text>
      {profile.phone ? <Text style={styles.meta}>{profile.phone}</Text> : null}
      {profile.role ? <Text style={styles.meta}>Role: {profile.role}</Text> : null}
      <View style={{ marginTop: 16 }}>
        <Button title="Apply to be a Vendor" onPress={async () => {
          try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || ''}/api/vendor/apply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId }),
            });
            const json = await res.json();
            if (!json?.success) throw new Error(json?.error || 'Failed');
            Alert.alert('Submitted', 'Your application is pending review.');
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Could not submit');
          }
        }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  name: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  meta: { fontSize: 14, color: '#3A3A3C', marginTop: 8 },
  empty: { textAlign: 'center', color: '#8E8E93', padding: 24 },
});

