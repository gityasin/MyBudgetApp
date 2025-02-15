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

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CategoriesProvider>
              <TransactionsProvider>
                <NavigationContainer>
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
