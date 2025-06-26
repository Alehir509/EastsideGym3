import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { CLERK_PUBLISHABLE_KEY } from './src/config'; // Make sure this path is correct
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  // This check is important to make sure you've set up your .env file correctly.
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file');
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ClerkProvider>
  );
}