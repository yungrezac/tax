import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MapPlaceholder() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Карта — плейсхолдер</Text>
      <View style={styles.mapBox}>
        <Text style={styles.mapText}>Здесь будет карта города Козьмодемьянск</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071033',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  mapBox: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    marginTop: 20,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    color: '#9aa4b0',
  },
  backButton: {
    marginVertical: 18,
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backText: { color: '#04263b', fontWeight: '700' }
});
