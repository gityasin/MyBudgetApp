import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { loadTransactions, saveTransactions } from '../services/storage';

const initialState = {
  transactions: [],
};

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
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
      dispatch({ type: 'SET_TRANSACTIONS', payload: stored });
    })();
  }, []);

  useEffect(() => {
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
