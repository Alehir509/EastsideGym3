import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Barcode } from 'react-native-svg-barcode';

/**
 * A reusable component to display a scannable barcode from a given value.
 * Enhanced to match the sleek design aesthetic.
 * @param {{ value: string }} props - The unique value to encode in the barcode.
 */
export default function BarcodeDisplay({ value }) {
  if (!value) {
    return <Text style={styles.loadingText}>Loading Barcode...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Barcode with enhanced styling */}
      <View style={styles.barcodeWrapper}>
        <Barcode
          value={value}
          format="CODE128"
          width={0.8}
          height={120}
          textColor="#000000"
          lineColor="#000000"
          background="#FFFFFF"
        />
      </View>

      {/* Barcode ID Display */}
      <Text style={styles.barcodeId}>{value.slice(-8).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    paddingVertical: 25,
    minWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    // Enhanced shadow for depth
    shadowColor: '#DCB335',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    // Subtle border
    borderWidth: 1,
    borderColor: 'rgba(220, 179, 53, 0.2)',
  },
  barcodeId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DCB335',
    marginTop: 15,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});