import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { List, Switch, Divider, Text, Surface, useTheme, Button } from 'react-native-paper';
import { scheduleDailyReminder } from '../notifications/NotificationsService';
import { useAppTheme } from '../../theme';
import { getAvailableCurrencies } from '../services/format';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const currencies = getAvailableCurrencies();

  // Load saved currency on component mount
  React.useEffect(() => {
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem('selectedCurrency');
      if (savedCurrency) {
        setSelectedCurrency(savedCurrency);
      }
    } catch (error) {
      console.warn('Error loading saved currency:', error);
    }
  };

  const handleCurrencyChange = async (currencyCode) => {
    setSelectedCurrency(currencyCode);
    try {
      await AsyncStorage.setItem('selectedCurrency', currencyCode);
    } catch (error) {
      console.warn('Error saving currency preference:', error);
    }
    setShowCurrencySelector(false);
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      await scheduleDailyReminder();
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const selectedCurrencyDetails = currencies.find(c => c.code === selectedCurrency);

  const renderCurrencySelector = () => {
    if (!showCurrencySelector) return null;

    return (
      <Surface style={[styles.currencySelector, { backgroundColor: colors.surface }]} elevation={5}>
        <View style={styles.currencySelectorHeader}>
          <Text variant="titleLarge" style={[styles.currencySelectorTitle, { color: colors.text }]}>
            Select Currency
          </Text>
          <TouchableOpacity onPress={() => setShowCurrencySelector(false)}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.currencyList}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyItem,
                selectedCurrency === currency.code && { backgroundColor: colors.primaryContainer }
              ]}
              onPress={() => handleCurrencyChange(currency.code)}
            >
              <Text style={[styles.currencyLabel, { color: colors.text }]}>
                {currency.label}
              </Text>
              {selectedCurrency === currency.code && (
                <List.Icon icon="check" color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Surface>
    );
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <Surface style={[styles.surface, { backgroundColor: colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text }]}>
            App Settings
          </Text>
          
          <List.Section>
            <List.Item
              title="Dark Mode"
              description="Toggle dark/light theme"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  color={colors.primary}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Daily Reminders"
              description="Get notified to add transactions"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  color={colors.primary}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Currency Format"
              description={`Current: ${selectedCurrencyDetails?.label || 'USD ($)'}`}
              left={props => <List.Icon {...props} icon="currency-usd" />}
              onPress={() => setShowCurrencySelector(true)}
            />
          </List.Section>
        </Surface>

        <Surface style={[styles.surface, styles.aboutSection, { backgroundColor: colors.surface }]} elevation={1}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          
          <List.Section>
            <List.Item
              title="Version"
              description="1.0.0"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="Get assistance with the app"
              left={props => <List.Icon {...props} icon="help-circle" />}
              onPress={() => {/* TODO: Implement help section */}}
            />
            <Divider />
            
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={props => <List.Icon {...props} icon="shield-account" />}
              onPress={() => {/* TODO: Implement privacy policy */}}
            />
          </List.Section>
        </Surface>
      </ScrollView>
      {renderCurrencySelector()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  surface: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  aboutSection: {
    marginTop: 8,
  },
  currencySelector: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -200 }],
    width: 300,
    maxHeight: 400,
    borderRadius: 8,
    padding: 16,
  },
  currencySelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencySelectorTitle: {
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyList: {
    flexGrow: 0,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  currencyLabel: {
    fontSize: 16,
  },
});
