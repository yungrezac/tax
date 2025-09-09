import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import useConvexRides from '../hooks/useConvexRides';
import Header from '../components/Header';
import CashBadge from '../components/CashBadge';

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const { createRide } = useConvexRides();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleRequest = async () => {
    if (!from || !to) return;
    const created = await createRide({ from, to, paymentMethod: 'cash' });
    setFrom('');
    setTo('');
    try {
      // save active ride id locally so user can re-open details later
      await AsyncStorage.setItem('activeRideId', created._id);
    } catch (e) {
      // ignore storage errors for now
      console.warn('Failed to save active ride id', e);
    }
    // navigate to details of created ride (Convex returns _id)
    navigation.navigate('RideDetails' as never, { id: created._id } as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Заказать такси" subtitle="Оплата — только наличными" />

      <View style={styles.form}>
        <TextInput
          placeholder="Откуда"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={from}
          onChangeText={setFrom}
        />
        <TextInput
          placeholder="Куда"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={to}
          onChangeText={setTo}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleRequest}>
          <Text style={styles.primaryButtonText}>Вызвать такси</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerNote}>
        <CashBadge />
        <Text style={styles.noteText}>По городу Козьмодемьянск • Быстро и надёжно</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#071033',
  },
  header: {
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '800',
  },
  sub: {
    color: '#94a3b8',
    marginTop: 6,
  },
  form: {
    marginTop: 24,
  },
  input: {
    backgroundColor: '#0b1220',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#06b6d4',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#04263b',
    fontWeight: '700',
  },
  footerNote: {
    position: 'absolute',
    bottom: 18,
    left: 20,
  },
  noteText: {
    color: '#94a3b8'
  }
});
