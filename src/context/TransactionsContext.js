import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { loadTransactions, saveTransactions } from '../services/storage';

const initialState = {
  transactions: [],
};

function transactionsReducer(state, action) {
  console.log("Reducer called with action:", action); // Add this line

  switch (action.type) {
    case 'SET_TRANSACTIONS':
      console.log("Setting transactions:", action.payload); // Add this line
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      console.log("Adding transaction:", action.payload); // Add this line
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      console.log("Updating transaction:", action.payload); // Add this line
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.id === action.payload.id ? action.payload : tx
        ),
      };
    case 'DELETE_TRANSACTION':
      console.log("Deleting transaction with ID:", action.payload); // Add this line
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

  useEffect(() => {
    (async () => {
      const stored = await loadTransactions();
      console.log("Loaded transactions from storage:", stored); // Add this line
      dispatch({ type: 'SET_TRANSACTIONS', payload: stored });
    })();
  }, []);

  useEffect(() => {
    console.log("Saving transactions to storage:", state.transactions); // Add this line
    saveTransactions(state.transactions);
  }, [state.transactions]);

  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}