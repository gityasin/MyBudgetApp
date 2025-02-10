import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Switch } from 'react-native';
import { useTransactions } from '../context/TransactionsContext';
import { useAppTheme } from '../../theme';

export default function AddTransactionScreen({ navigation }) {
  const { dispatch } = useTransactions();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const { colors } = useAppTheme();

  const handleAdd = () => {
    if (!description || !amount || isNaN(amount)) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        category,
        isRecurring,
      },
    });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Add Transaction</Text>

      <TextInput
        style={[styles.input, { borderColor: colors.primary }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.primary }]}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, { borderColor: colors.primary }]}
        placeholder="Category (e.g. Food)"
        value={category}
        onChangeText={setCategory}
      />
      <View style={styles.switchRow}>
        <Text>Recurring Monthly?</Text>
        <Switch value={isRecurring} onValueChange={setIsRecurring} />
      </View>

      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  switchRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
