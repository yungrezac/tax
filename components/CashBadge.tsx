import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CashBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>НАЛИЧНЫЕ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fde68a',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  text: {
    color: '#92400e',
    fontWeight: '800',
    fontSize: 12,
  }
});
