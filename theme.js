import React, { createContext, useContext } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    background: '#ffffff',
    text: '#1F2937',
    accent: '#F59E0B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const ThemeContext = createContext(theme);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={theme}>
      {/* PaperProvider is optional, only if you use react-native-paper */}
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
