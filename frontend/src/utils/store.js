// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

// Reducer to manage wallet address
const walletReducer = (state = { address: '' }, action) => {
  switch (action.type) {
    case 'SET_WALLET_ADDRESS':
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

// Create store
export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});
