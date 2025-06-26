import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Barcode } from 'react-native-svg-barcode';

/**
 * A reusable component to display a scannable barcode from a given value.
 * @param {{ value: string }} props - The unique value to encode in the barcode.
 */
export default function BarcodeDisplay({ value }) {
  if (!value) {
    return <Text>Loading Barcode...</Text>;
  }

  return (
    <View style={styles.container}>
      <Barcode
        value={value}
        format="CODE128"
        width={0.75}
        height={150}
        textColor="#000000"
        lineColor="#000000"
        background="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // --- FIX: Change the width to be less than 100% to create margins ---
    width: '90%', // <-- Changed from '100%' to '90%'
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
});