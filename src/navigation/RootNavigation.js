import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import ChartScreen from '../screens/ChartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

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

function TabNavigator() {
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

export default function RootNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigation = useNavigation();

  const checkOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('Checking onboarding status:', status);
      setHasCompletedOnboarding(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Add a listener for changes to AsyncStorage
  useEffect(() => {
    const listener = navigation => {
      if (navigation.type === 'state') {
        checkOnboardingStatus();
      }
    };

    const unsubscribe = navigation?.addListener('state', listener);
    return () => unsubscribe?.();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering RootNavigation, hasCompletedOnboarding:', hasCompletedOnboarding);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <RootStack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{
            animationEnabled: true,
            gestureEnabled: false
          }}
        />
      ) : (
        <RootStack.Screen 
          name="MainApp" 
          component={TabNavigator}
          options={{
            animationEnabled: true,
          }}
        />
      )}
    </RootStack.Navigator>
  );
}
