import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import useConvexRides, { useRide } from '../hooks/useConvexRides';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RideDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { updateRideStatus } = useConvexRides();
  const { id } = (route.params || {}) as { id?: string };
  // realtime-подписка на заказ
  const ride = useRide(id || '');

  const [loadingAction, setLoadingAction] = useState(false);
  // Animated toast for status changes
  const toastY = useRef(new Animated.Value(-60)).current;
  const [toastText, setToastText] = useState<string | null>(null);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ride) return;
    const prev = prevStatusRef.current;
    if (prev && prev !== ride.status) {
      // show toast
      const text = `Статус: ${ride.status.replace('_', ' ')}`;
      setToastText(text);
      Animated.sequence([
        Animated.timing(toastY, { toValue: 10, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(toastY, { toValue: -60, duration: 300, easing: Easing.in(Easing.cubic), useNativeDriver: true })
      ]).start(() => setToastText(null));
    }
    prevStatusRef.current = ride.status;
  }, [ride, toastY]);

  if (!ride) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Заказ не найден</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backText}>Назад</Text></TouchableOpacity>
      </View>
    );
  }

  const handleStart = async () => {
    try {
      setLoadingAction(true);
      await updateRideStatus(ride._id, 'in_progress');
      // do not navigate back immediately; let realtime update reflect the change
    } finally { setLoadingAction(false); }
  };

  const handleComplete = async () => {
    try {
      setLoadingAction(true);
      await updateRideStatus(ride._id, 'completed');
      // clear active id
      try { await AsyncStorage.removeItem('activeRideId'); } catch (e) { }
      // navigate back shortly after status update to allow toast to show
      setTimeout(() => navigation.goBack(), 900);
    } finally { setLoadingAction(false); }
  };

  const handleCancel = async () => {
    try {
      setLoadingAction(true);
      await updateRideStatus(ride._id, 'cancelled');
      try { await AsyncStorage.removeItem('activeRideId'); } catch (e) { }
      setTimeout(() => navigation.goBack(), 900);
    } finally { setLoadingAction(false); }
  };

  return (
    <View style={styles.container}>
      {toastText && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastY }] }]}>
          <Text style={styles.toastText}>{toastText}</Text>
        </Animated.View>
      )}
      <Text style={styles.title}>Детали заказа</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Откуда</Text>
        <Text style={styles.value}>{ride.from}</Text>

        <Text style={styles.label}>Куда</Text>
        <Text style={styles.value}>{ride.to}</Text>

        <Text style={styles.label}>Оплата</Text>
        <Text style={styles.value}>{ride.paymentMethod === 'cash' ? 'Наличные' : 'Карта'}</Text>

        <Text style={styles.label}>Статус</Text>
        <Text style={styles.value}>{ride.status}</Text>

      </View>

      {ride.status === 'accepted' && (
        <TouchableOpacity style={styles.primaryButton} onPress={handleStart} disabled={loadingAction}><Text style={styles.primaryText}>{loadingAction ? 'Обновление...' : 'Начать поездку'}</Text></TouchableOpacity>
      )}

      {ride.status === 'in_progress' && (
        <TouchableOpacity style={styles.primaryButton} onPress={handleComplete} disabled={loadingAction}><Text style={styles.primaryText}>{loadingAction ? 'Обновление...' : 'Завершить'}</Text></TouchableOpacity>
      )}

      {ride.status === 'requested' && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loadingAction}><Text style={styles.cancelText}>{loadingAction ? 'Отмена...' : 'Отменить'}</Text></TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#071033' },
  toast: { position: 'absolute', left: 20, right: 20, top: 6, backgroundColor: '#06233b', padding: 12, borderRadius: 10, zIndex: 30, elevation: 30 },
  toastText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  card: { backgroundColor: '#0b1220', padding: 14, borderRadius: 12 },
  label: { color: '#9aa4b0', marginTop: 10 },
  value: { color: '#fff', fontWeight: '700', marginTop: 4 },
  primaryButton: { backgroundColor: '#34d399', padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  primaryText: { color: '#04263b', fontWeight: '800' },
  cancelButton: { backgroundColor: '#ef4444', padding: 12, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  cancelText: { color: '#fff', fontWeight: '700' },
  backButton: { marginTop: 20, backgroundColor: '#06b6d4', padding: 12, borderRadius: 12 },
  backText: { color: '#04263b', fontWeight: '700' }
});
