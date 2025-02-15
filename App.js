import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransactionsProvider } from './src/context/TransactionsContext';
import { CategoriesProvider } from './src/context/CategoriesContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigation from './src/navigation/RootNavigation';
import { ThemeProvider } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

// Configure linking for web
const linking = {
  prefixes: ['https://yasin.github.io/MyBudgetApp'],
  config: {
    screens: {
      HomeStack: {
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
                  fallback={<Text>Loading...</Text>}
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
