import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// authShim is exported as CommonJS for robustness in the Expo bundler
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useAuthActionsShim, useAuthStateShim } = require('../../lib/authShim');
import { useNavigation } from '@react-navigation/native';

export default function DriverLoginScreen() {
  const { signIn } = useAuthActionsShim();
  const { user } = useAuthStateShim();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      // navigate to driver home on successful auth
      navigation.navigate('DriverHome' as never);
    }
  }, [user, navigation]);

  const onSubmit = async () => {
    try {
      await signIn('password', { email, password, flow });
    } catch (err) {
      console.warn('Auth error', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход для водителей</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Пароль" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>{flow === 'signIn' ? 'Войти' : 'Зарегистрироваться'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}>
        <Text style={styles.switch}>{flow === 'signIn' ? 'Создать аккаунт' : 'Войти вместо этого'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 10, marginBottom: 12 },
  button: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  switch: { marginTop: 16, textAlign: 'center', color: '#374151' },
});
