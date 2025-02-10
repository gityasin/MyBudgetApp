import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme';

export default function TransactionItem({ transaction }) {
  const { colors, spacing } = useAppTheme();

  return (
    <View style={[styles.itemContainer, { marginBottom: spacing.sm }]}>
      <View>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>
          {transaction.description}
        </Text>
        <Text style={{ color: colors.text, fontSize: 12 }}>
          {transaction.date}
        </Text>
      </View>
      <Text style={{ color: colors.accent }}>
        -${transaction.amount.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
});
