import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Surface, useTheme, Divider } from 'react-native-paper';
import { useTransactions } from '../context/TransactionsContext';
import TransactionItem from '../components/TransactionItem';

export default function HomeScreen({ navigation }) {
  const { state } = useTransactions();
  const theme = useTheme();

  const total = state.transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const income = state.transactions
    .filter(tx => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);
  const expenses = state.transactions
    .filter(tx => tx.amount < 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const renderHeader = () => (
    <>
      <Surface style={styles.summaryContainer} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          My Budget
        </Text>
        
        <View style={styles.balanceRow}>
          <Text variant="titleLarge">Total Balance</Text>
          <Text 
            variant="headlineMedium"
            style={{ color: total >= 0 ? theme.colors.success : theme.colors.error }}
          >
            ${total.toFixed(2)}
          </Text>
        </View>

        <Divider style={styles.divider} />
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.success }}>
              Income
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.success }}>
              +${income.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.error }}>
              Expenses
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.error }}>
              ${expenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </Surface>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Recent Transactions
      </Text>
    </>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={{ color: theme.colors.textSecondary }}>
        No transactions yet
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary }}>
        Tap the + button to add your first transaction
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={state.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item}
            onPress={() => {
              // TODO: Implement transaction details/edit screen
              console.log('Transaction pressed:', item);
            }}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
        label="Add Transaction"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
