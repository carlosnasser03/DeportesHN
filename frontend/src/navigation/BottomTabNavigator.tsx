/**
 * Bottom Tab Navigator - Navegación principal
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import { CategoriesScreen } from '@/screens/CategoriesScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

// Stacks
import { CategoryDetailsScreen } from '@/screens/CategoryDetailsScreen';
import { TeamDetailsScreen } from '@/screens/TeamDetailsScreen';

import { COLORS } from '@/styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { color: COLORS.text.primary },
      }}
    >
      <Stack.Screen
        name="CategoriesList"
        component={CategoriesScreen}
        options={{ title: 'Categorías' }}
      />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{ title: 'Equipos' }}
      />
      <Stack.Screen
        name="TeamDetails"
        component={TeamDetailsScreen}
        options={{ title: 'Partidos del Equipo' }}
      />
    </Stack.Navigator>
  );
}

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={CategoriesStack}
        options={{
          tabBarLabel: 'Categorías',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sports-soccer" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
