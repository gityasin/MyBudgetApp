import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Switch, Text, HelperText, Portal, Snackbar } from 'react-native-paper';
import { useTransactions } from '../context/TransactionsContext';
import { useAppTheme } from '../../theme';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

export default function AddTransactionScreen({ navigation }) {
  const { dispatch } = useTransactions();
  const { theme } = useAppTheme();
  const { colors, spacing, typography } = theme;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now().toString(),
        description: description.trim(),
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        category: category.trim(),
        isRecurring,
      },
    });

    setShowSnackbar(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.primary }]}>
        Add Transaction
      </Text>

      <TextInput
        mode="outlined"
        label="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setErrors({ ...errors, description: '' });
        }}
        error={!!errors.description}
        style={styles.input}
        accessibilityLabel="Transaction description input"
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <TextInput
        mode="outlined"
        label="Amount"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setErrors({ ...errors, amount: '' });
        }}
        keyboardType="decimal-pad"
        error={!!errors.amount}
        style={styles.input}
        left={<TextInput.Affix text="$" />}
        accessibilityLabel="Transaction amount input"
      />
      <HelperText type="error" visible={!!errors.amount}>
        {errors.amount}
      </HelperText>

      <TextInput
        mode="outlined"
        label="Category"
        value={category}
        onChangeText={(text) => {
          setCategory(text);
          setErrors({ ...errors, category: '' });
        }}
        error={!!errors.category}
        style={styles.input}
        accessibilityLabel="Transaction category input"
      />
      <HelperText type="info" visible={true}>
        Suggested: {CATEGORIES.join(', ')}
      </HelperText>

      <View style={styles.switchContainer}>
        <Text variant="bodyLarge">Recurring Monthly?</Text>
        <Switch
          value={isRecurring}
          onValueChange={setIsRecurring}
          color={colors.primary}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        accessibilityLabel="Add transaction button"
      >
        Add Transaction
      </Button>

      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={2000}
          style={{ backgroundColor: colors.success }}
        >
          Transaction added successfully!
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
