import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectScreen() {
  const navigation = useNavigation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const active = await AsyncStorage.getItem('activeRideId');
        if (mounted && active) {
          // navigate directly to ride details if there's an active ride
          navigation.navigate('RideDetails' as never, { id: active } as never);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigation]);

  const handleClient = async () => {
    try {
      const active = await AsyncStorage.getItem('activeRideId');
      if (active) {
        navigation.navigate('RideDetails' as never, { id: active } as never);
        return;
      }
    } catch (e) {
      // ignore
    }
    navigation.navigate('ClientHome' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Такси Козьмодемьянск</Text>
      <Text style={styles.subtitle}>Выберите роль</Text>

      <TouchableOpacity
        style={[styles.button, styles.clientButton]}
        onPress={handleClient}
      >
        <Text style={styles.buttonText}>Я — пассажир</Text>
        <Text style={styles.buttonSub}>Только наличные</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.driverButton]}
        onPress={() => navigation.navigate('DriverLogin')}
      >
        <Text style={styles.buttonText}>Я — водитель</Text>
        <Text style={styles.buttonSub}>Принимаю наличные</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Город: Козьмодемьянск</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9ca3af',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    padding: 18,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: 'center',
  },
  clientButton: {
    backgroundColor: '#06b6d4',
  },
  driverButton: {
    backgroundColor: '#34d399',
  },
  buttonText: {
    color: '#04263b',
    fontWeight: '700',
    fontSize: 18,
  },
  buttonSub: {
    color: '#04263b',
    opacity: 0.9,
  },
  footer: {
    color: '#94a3b8',
    position: 'absolute',
    bottom: 24,
  }
});
