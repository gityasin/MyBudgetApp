import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { loadTransactions, saveTransactions } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  transactions: [],
};

function transactionsReducer(state, action) {
  console.log("Reducer called with action:", action);

  switch (action.type) {
    case 'SET_TRANSACTIONS':
      console.log("Setting transactions:", action.payload);
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      console.log("Adding transaction:", action.payload);
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      console.log("Updating transaction:", action.payload);
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.id === action.payload.id ? action.payload : tx
        ),
      };
    case 'DELETE_TRANSACTION':
      console.log("Deleting transaction with ID:", action.payload);
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload)
      };
    default:
      return state;
  }
}

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const [stored, storedCurrency] = await Promise.all([
        loadTransactions(),
        AsyncStorage.getItem('selectedCurrency')
      ]);

      dispatch({ type: 'SET_TRANSACTIONS', payload: stored });
      
      if (storedCurrency) {
        setSelectedCurrency(storedCurrency);
      }
    };

    loadInitialData();
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    console.log("Saving transactions to storage:", state.transactions);
    saveTransactions(state.transactions);
  }, [state.transactions]);

  // Handle currency changes - now just updates the display currency
  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === selectedCurrency) return;

    try {
      await AsyncStorage.setItem('selectedCurrency', newCurrency);
      setSelectedCurrency(newCurrency);
    } catch (error) {
      console.error('Error changing currency:', error);
    }
  };

  return (
    <TransactionsContext.Provider 
      value={{ 
        state, 
        dispatch,
        selectedCurrency,
        handleCurrencyChange
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}