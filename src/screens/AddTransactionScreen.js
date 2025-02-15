import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Switch, Text, HelperText, useTheme, SegmentedButtons, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionsContext';
import { useCategories } from '../context/CategoriesContext';
import { getCurrencySymbol } from '../services/format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

const CustomSnackbar = ({ visible, message, style }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.snackbar,
        style,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <Text style={styles.snackbarText}>{message}</Text>
    </Animated.View>
  );
};

export default function AddTransactionScreen({ navigation, route }) {
  console.log('=== AddTransactionScreen Component Start ===');
  console.log('Navigation prop:', navigation);
  console.log('Route prop:', route);
  
  const { dispatch } = useTransactions();
  const { categories, addCategory } = useCategories();
  console.log('TransactionsContext dispatch available:', !!dispatch);
  
  const theme = useTheme();
  console.log('Theme loaded:', !!theme);
  
  const { colors } = theme;
  const { t } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  console.log('AddTransactionScreen mounted with route params:', route.params);

  const params = route.params || {};
  const isEditing = Boolean(params.isEditing);
  const existingTransaction = params.transaction;

  console.log('Is editing:', isEditing);
  console.log('Existing transaction:', existingTransaction);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    console.log('Setting form values. IsEditing:', isEditing, 'Transaction:', existingTransaction);
    if (isEditing && existingTransaction) {
      console.log('Existing transaction ID:', existingTransaction.id);
      setDescription(existingTransaction.description || '');
      setAmount(existingTransaction.amount ? Math.abs(existingTransaction.amount).toString() : '');
      setCategory(existingTransaction.category || '');
      setIsRecurring(Boolean(existingTransaction.isRecurring));
      setTransactionType(existingTransaction.amount < 0 ? 'expense' : 'income');
    }
    loadSelectedCurrency();
  }, [isEditing, existingTransaction]);

  const loadSelectedCurrency = async () => {
    try {
      const currency = await AsyncStorage.getItem('selectedCurrency');
      if (currency) {
        setSelectedCurrency(currency);
      }
    } catch (error) {
      console.warn('Error loading currency preference:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = t('descriptionRequired');
    }

    if (!amount) {
      newErrors.amount = t('amountRequired');
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = t('invalidAmount');
    }

    if (!category.trim()) {
      newErrors.category = t('categoryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const parsedAmount = parseFloat(amount);
    const finalAmount = transactionType === 'expense' ? -parsedAmount : parsedAmount;
    const trimmedCategory = category.trim();

    // If the category is new (not in the existing categories), add it
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      await addCategory(trimmedCategory);
    }

    const transactionData = {
      description: description.trim(),
      amount: finalAmount,
      date: new Date().toISOString().split('T')[0],
      category: trimmedCategory,
      isRecurring,
      type: transactionType,
    };

    if (isEditing) {
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: existingTransaction.id,
          ...transactionData,
        },
      });
    } else {
      const newTransactionId = Date.now().toString();
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: newTransactionId,
          ...transactionData,
        },
      });
    }

    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.primary }]}>
            {isEditing ? t('editTransaction') : t('addTransaction')}
          </Text>

          <SegmentedButtons
            value={transactionType}
            onValueChange={setTransactionType}
            buttons={[
              { value: 'expense', label: t('expense') },
              { value: 'income', label: t('income') },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            mode="outlined"
            label={t('description')}
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
            label={t('amount')}
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setErrors({ ...errors, amount: '' });
            }}
            keyboardType="decimal-pad"
            error={!!errors.amount}
            style={styles.input}
            left={<TextInput.Affix text={getCurrencySymbol(selectedCurrency)} />}
            accessibilityLabel="Transaction amount input"
          />
          <HelperText type="error" visible={!!errors.amount}>
            {errors.amount}
          </HelperText>

          <View style={styles.categoryInputContainer}>
            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <TextInput
                  mode="outlined"
                  label={t('category')}
                  value={category}
                  onChangeText={(text) => {
                    setCategory(text);
                    setErrors({ ...errors, category: '' });
                  }}
                  error={!!errors.category}
                  style={[styles.input, { flex: 1 }]}
                  right={
                    <TextInput.Icon 
                      icon={() => (
                        <MaterialCommunityIcons
                          name="menu-down"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                      onPress={() => setShowCategoryMenu(true)}
                    />
                  }
                  onPressIn={() => setShowCategoryMenu(true)}
                  accessibilityLabel="Transaction category input"
                />
              }
            >
              {categories.map((cat) => (
                <Menu.Item
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryMenu(false);
                    setErrors({ ...errors, category: '' });
                  }}
                  title={cat}
                />
              ))}
            </Menu>
          </View>
          <HelperText type="error" visible={!!errors.category}>
            {errors.category}
          </HelperText>

          <View style={styles.switchContainer}>
            <Text variant="bodyLarge">{t('recurringMonthly')}</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              color={colors.primary}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            accessibilityLabel={isEditing ? "Update transaction button" : "Add transaction button"}
          >
            {isEditing ? t('update') : t('add')}
          </Button>
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={showSnackbar}
        message={isEditing ? t('transactionUpdated') : t('transactionAdded')}
        style={{ backgroundColor: colors.success }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  switchLabel: {
    marginLeft: 8,
  },
  snackbar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  snackbarText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});