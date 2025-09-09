import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  showMapButton?: boolean;
};

export default function Header({ title, subtitle, showMapButton = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showMapButton && (
        <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('Map' as never)}>
          <Text style={styles.mapButtonText}>Карта</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 2,
  },
  mapButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  mapButtonText: {
    color: '#04263b',
    fontWeight: '800',
  }
});
