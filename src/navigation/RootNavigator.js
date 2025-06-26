import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator } from 'react-native';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();

  // Show a loading screen while Clerk checks for a session
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If the user is signed in, show the AppStack. Otherwise, show the AuthStack.
  return isSignedIn ? <AppStack /> : <AuthStack />;
}
