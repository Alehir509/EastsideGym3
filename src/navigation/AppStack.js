import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screens for this stack
import HomeScreen from '../screens/HomeScreen';
// We will add BarcodeScreen and ProfileScreen here later

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    // This navigator contains the core screens of your application.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Stack.Screen name="Barcode" component={BarcodeScreen} /> */}
    </Stack.Navigator>
  );
}