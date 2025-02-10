import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, List, useTheme, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORY_ICONS = {
  Food: 'food',
  Transport: 'car',
  Shopping: 'shopping',
  Bills: 'file-document',
  Entertainment: 'gamepad-variant',
  Other: 'dots-horizontal',
};

export default function TransactionItem({ transaction, onPress }) {
  const theme = useTheme();
  const { colors } = theme;

  const isExpense = transaction.amount < 0;
  const amount = Math.abs(transaction.amount);
  const icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other;
  
  const formattedDate = new Date(transaction.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Surface style={styles.surface} elevation={1}>
      <TouchableRipple
        onPress={onPress}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`${transaction.description} transaction of ${isExpense ? 'expense' : 'income'} $${amount.toFixed(2)}`}
      >
        <List.Item
          title={transaction.description}
          description={`${transaction.category} • ${formattedDate}`}
          left={props => (
            <List.Icon
              {...props}
              icon={icon}
              color={colors.primary}
            />
          )}
          right={props => (
            <Text
              {...props}
              variant="titleMedium"
              style={[
                styles.amount,
                { color: isExpense ? colors.error : colors.success }
              ]}
            >
              {isExpense ? '-' : '+'}${amount.toFixed(2)}
            </Text>
          )}
          titleStyle={styles.title}
          descriptionStyle={[styles.description, { color: colors.textSecondary }]}
        />
      </TouchableRipple>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
  },
  description: {
    marginTop: 4,
  },
  amount: {
    fontWeight: '600',
    alignSelf: 'center',
  },
});
