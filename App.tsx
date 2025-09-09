import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import RoleSelectScreen from './screens/RoleSelectScreen';
import ClientHomeScreen from './screens/ClientHomeScreen';
import DriverHomeScreen from './screens/DriverHomeScreen';
import RideDetailsScreen from './screens/RideDetailsScreen';
import DriverLoginScreen from './screens/Auth/DriverLoginScreen';
import { Authenticated, Unauthenticated, AuthLoading, AuthProvider } from '@convex-dev/auth/react';

const Stack = createStackNavigator();

function DriverProtected() {
  return (
    <>
      <AuthLoading />
      <Unauthenticated>
        <DriverLoginScreen />
      </Unauthenticated>
      <Authenticated>
        <DriverHomeScreen />
      </Authenticated>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleSelect">
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ClientHome" component={ClientHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverHome" component={DriverProtected} options={{ headerShown: false }} />
          <Stack.Screen name="RideDetails" component={RideDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
