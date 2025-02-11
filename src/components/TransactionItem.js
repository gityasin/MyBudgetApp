import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, List, useTheme, TouchableRipple, Menu, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionsContext';
import { useNavigation } from '@react-navigation/native';

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
  const { dispatch } = useTransactions();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const isExpense = transaction.amount < 0;
  const amount = Math.abs(transaction.amount);
  const icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other;

  const formattedDate = new Date(transaction.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: transaction.id,
    });
    setMenuVisible(false);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    console.log('Editing transaction:', transaction); // Log the transaction here!
    navigation.navigate('AddTransaction', {
      isEditing: true,
      transaction: {
        ...transaction,
        amount: Math.abs(transaction.amount),
      },
    });
  };

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
            <View style={styles.rightContainer}>
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
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={handleEdit}
                  title="Edit"
                  leadingIcon="pencil"
                />
                <Menu.Item
                  onPress={handleDelete}
                  title="Delete"
                  leadingIcon="delete"
                />
              </Menu>
            </View>
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});