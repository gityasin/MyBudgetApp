import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TransactionsProvider } from './src/context/TransactionsContext';
import RootNavigation from './src/navigation/RootNavigation';

// Optional: theming approach; omit if you don't need custom theming
import { ThemeProvider } from './theme';

export default function App() {
  return (
    <TransactionsProvider>
      <ThemeProvider>
        <NavigationContainer
          linking={{
            prefixes: ['https://my-budget-app.example', 'mybudgetapp://'],
            config: {
              screens: {
                HomeStack: {
                  screens: {
                    Home: 'home',
                    AddTransaction: 'add',
                  },
                },
                Charts: 'charts',
                Settings: 'settings'
              },
            },
          }}
        >
          <RootNavigation />
        </NavigationContainer>
      </ThemeProvider>
    </TransactionsProvider>
  );
}
