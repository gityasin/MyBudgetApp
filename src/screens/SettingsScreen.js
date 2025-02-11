import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, Text, Surface, useTheme } from 'react-native-paper';
import { scheduleDailyReminder } from '../notifications/NotificationsService';

export default function SettingsScreen() {
  const theme = useTheme();
  const { colors } = theme;
  
  const [isDarkMode, setIsDarkMode] = useState(theme.dark);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currencyFormat, setCurrencyFormat] = useState('USD');

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      await scheduleDailyReminder();
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Surface style={styles.surface} elevation={1}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.primary }]}>
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
                onValueChange={setIsDarkMode}
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
            description="Set your preferred currency"
            left={props => <List.Icon {...props} icon="currency-usd" />}
            onPress={() => {/* TODO: Implement currency selector */}}
          />
        </List.Section>
      </Surface>

      <Surface style={[styles.surface, styles.aboutSection]} elevation={1}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.primary }]}>
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
  );
}

const styles = StyleSheet.create({
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
});
