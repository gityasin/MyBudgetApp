import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { VictoryPie, VictoryLabel, VictoryLegend, VictoryAnimation } from 'victory-native';
import { Text, Surface, useTheme, SegmentedButtons } from 'react-native-paper';
import { useTransactions } from '../context/TransactionsContext';

const CHART_TYPES = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'donut', label: 'Donut Chart' },
];

export default function ChartScreen() {
  const { state } = useTransactions();
  const theme = useTheme();
  const [chartType, setChartType] = useState('donut');

  // Calculate category totals and percentages for expenses only
  const categorySums = state.transactions
    .filter(tx => tx.amount < 0) // Only include expenses
    .reduce((acc, tx) => {
      const cat = tx.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + Math.abs(tx.amount); // Use absolute value for display
      return acc;
    }, {});

  const total = Object.values(categorySums).reduce((sum, amount) => sum + amount, 0);

  const chartData = Object.entries(categorySums).map(([category, amount]) => ({
    x: category,
    y: amount,
    percentage: ((amount / total) * 100).toFixed(1)
  }));

  const colorScale = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.error,
    theme.colors.success,
    theme.colors.warning,
    '#9333EA', // Additional colors for more categories
    '#2563EB',
    '#DC2626',
  ];

  if (chartData.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={styles.noDataText}>
          No expense data available
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.textSecondary }}>
          Add some expenses to see your spending breakdown
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
        Expense Breakdown
      </Text>
      
      <Surface style={styles.chartContainer} elevation={2}>
        <Text variant="titleLarge" style={[styles.totalAmount, { color: theme.colors.error }]}>
          Total Spent: ${total.toFixed(2)}
        </Text>

        <SegmentedButtons
          value={chartType}
          onValueChange={setChartType}
          buttons={CHART_TYPES}
          style={styles.segmentedButtons}
        />
        
        <VictoryPie
          data={chartData}
          colorScale={colorScale}
          innerRadius={chartType === 'donut' ? 100 : 0}
          padAngle={2}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
          height={350}
          width={Dimensions.get('window').width - 32}
          labels={() => ''}
          labelComponent={<VictoryLabel text={''} />}
          style={{
            data: {
              stroke: theme.colors.background,
              strokeWidth: 1,
            },
            labels: { display: 'none' }
          }}
        />

        <View style={styles.legendContainer}>
          <VictoryLegend
            x={50}
            y={20}
            orientation="horizontal"
            gutter={20}
            style={{
              labels: { fill: theme.colors.text }
            }}
            data={chartData.map((d, i) => ({
              name: `${d.x}: $${d.y.toFixed(2)} (${d.percentage}%)`,
              symbol: { fill: colorScale[i % colorScale.length] }
            }))}
          />
        </View>
      </Surface>

      <Surface style={styles.summaryContainer} elevation={2}>
        <Text variant="titleMedium" style={{ color: theme.colors.text }}>
          Summary
        </Text>
        {chartData.map((item, index) => (
          <View key={item.x} style={styles.summaryRow}>
            <View style={styles.categoryInfo}>
              <View 
                style={[
                  styles.colorIndicator, 
                  { backgroundColor: colorScale[index % colorScale.length] }
                ]} 
              />
              <Text variant="bodyMedium">{item.x}</Text>
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
              ${item.y.toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text variant="titleMedium">Total</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  totalAmount: {
    textAlign: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});
