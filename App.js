import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransactionsProvider } from './src/context/TransactionsContext';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigation from './src/navigation/RootNavigation';
import { ThemeProvider } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, Text } from 'react-native';

const linking = {
  enabled: true,
  config: {
    screens: {
      HomeStack: {
        path: '',
        screens: {
          Home: '',
          AddTransaction: 'add-transaction',
        }
      },
      Charts: 'charts',
      Settings: 'settings',
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CategoriesProvider>
              <TransactionsProvider>
                <NavigationContainer
                  linking={Platform.OS === 'web' ? linking : undefined}
                >
                  <RootNavigation />
                </NavigationContainer>
              </TransactionsProvider>
            </CategoriesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
