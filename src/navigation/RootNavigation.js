import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import ChartScreen from '../screens/ChartScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'My Budget',
        }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={({ route }) => ({
          title: route.params?.isEditing ? 'Edit Transaction' : 'Add Transaction',
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
        })}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { colors } = useTheme();

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '600',
    },
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      paddingVertical: 8,
      height: 60,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
