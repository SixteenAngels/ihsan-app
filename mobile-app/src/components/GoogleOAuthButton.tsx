
import React from 'react';
import { Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '../lib/supabase';

export default function GoogleOAuthButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Use your Google OAuth client ID here
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Exchange Google token for Supabase session
      supabase.auth.signInWithIdToken({
        provider: 'google',
        token: authentication?.idToken || '',
      });
    }
  }, [response]);

  return <Button title="Sign in with Google" onPress={() => promptAsync()} disabled={!request} />;
}
