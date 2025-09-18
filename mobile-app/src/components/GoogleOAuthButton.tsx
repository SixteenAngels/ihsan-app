import React from 'react';
import { Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined;
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined;

export default function GoogleOAuthButton() {
  const redirectUri = Linking.createURL('/');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId,
    androidClientId,
    webClientId,
    redirectUri,
    selectAccount: true,
  });

  React.useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        try {
          const idToken = (response.params as any)?.id_token || response.authentication?.idToken || '';
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });
          if (error) throw error;
        } catch (e: any) {
          Alert.alert('Google Sign-in Error', e.message || 'Failed to sign in');
        }
      }
    })();
  }, [response]);

  return <Button title="Sign in with Google" onPress={() => promptAsync()} disabled={!request} />;
}
