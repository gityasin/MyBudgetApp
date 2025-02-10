import React from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import { scheduleDailyReminder } from '../notifications/NotificationsService';
import { useAppTheme } from '../../theme';

export default function SettingsScreen() {
  const { colors } = useAppTheme();

  const handleScheduleNotification = () => {
    if (Platform.OS === 'web') {
      alert('Push notifications are limited on web with Expo. Please try on iOS/Android.');
    } else {
      scheduleDailyReminder();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text, fontSize: 18, marginBottom: 16 }}>Settings</Text>
      <Button
        title="Schedule Daily Reminder"
        onPress={handleScheduleNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
