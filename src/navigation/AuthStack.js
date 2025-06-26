import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screens for this stack
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Create a new stack navigator
const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    // This navigator contains all the screens for the signed-out user flow.
    // We've turned off the header for a cleaner look, as we'll build our own.
    <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: false // This disables swipe gestures
    }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}