import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useTransactions } from '../context/TransactionsContext';
import { useAppTheme } from '../../theme';

export default function ChartScreen() {
  const { state } = useTransactions();
  const { colors } = useAppTheme();

  const categorySums = state.transactions.reduce((acc, tx) => {
    const cat = tx.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categorySums).map(([category, amount]) => ({
    x: category,
    y: amount,
  }));

  if (chartData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={{ color: colors.text }}>No transaction data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VictoryPie
        data={chartData}
        colorScale="qualitative"
        innerRadius={50}
        height={300}
        width={Dimensions.get('window').width}
        labels={({ datum }) => `${datum.x}\n$${datum.y.toFixed(2)}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
