/**
 * Punto de entrada principal de la app
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';
import { useAppStore } from '@/stores/appStore';

export default function App() {
  const loadFromStorage = useAppStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Cargar estado guardado al iniciar la app
    loadFromStorage();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </>
  );
}
