import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { useTransactions } from '../context/TransactionsContext';
import TransactionItem from '../components/TransactionItem';
import { useAppTheme } from '../../theme';

export default function HomeScreen({ navigation }) {
  const { state } = useTransactions();
  const { colors, spacing } = useAppTheme();

  const total = state.transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>My Budget</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Total Spent: ${total.toFixed(2)}
      </Text>

      <FlatList
        data={state.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        style={{ marginTop: spacing.md }}
      />

      <Button
        title="Add Transaction"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
  },
});
