import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import useConvexRides from '../hooks/useConvexRides';
import { useAuthStateShim, useAuthActionsShim } from '../lib/authShim';
import { useNavigation } from '@react-navigation/native';

// authShim CommonJS require for robustness
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useAuthStateShim } = require('../lib/authShim');

export default function DriverHomeScreen() {
  const navigation = useNavigation();
  const { listRequested, acceptRide, currentUser } = useConvexRides();
  const { user } = useAuthStateShim();
  const { signOut } = useAuthActionsShim();

  useEffect(() => {
    if (!user) {
      navigation.navigate('DriverLogin' as never);
    }
  }, [user, navigation]);

  const rides = listRequested || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Заявки</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RideDetails' as never, { id: item._id } as never)}>
            <Text style={styles.fromTo}>{item.from} → {item.to}</Text>
            <Text style={styles.meta}>Оплата: {item.paymentMethod}</Text>
            <TouchableOpacity style={styles.accept} onPress={async () => {
              try {
                await acceptRide(item._id);
              } catch (err) {
                console.warn('Accept error', err);
              }
            }}>
              <Text style={{ color: '#fff' }}>Принять</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.signOut} onPress={() => signOut()}>
        <Text style={{ color: '#fff' }}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', marginBottom: 10 },
  fromTo: { fontWeight: '700' },
  meta: { color: '#6b7280' },
  accept: { position: 'absolute', right: 12, top: 12, backgroundColor: '#10b981', padding: 8, borderRadius: 8 },
  signOut: { backgroundColor: '#ef4444', padding: 12, borderRadius: 10, position: 'absolute', bottom: 24, left: 20, right: 20, alignItems: 'center' },
});
