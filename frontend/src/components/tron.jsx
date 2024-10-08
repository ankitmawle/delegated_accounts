// src/components/ConnectWallet.jsx
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { tronWeb } from '../utils/tronWebUtils';
import { useSelector, useDispatch } from 'react-redux';
const ConnectWallet = () => {
    const walletAddress = useSelector((state) => state.wallet.address);
    const dispatch = useDispatch();

    const setWalletAddress = (address) => {
      dispatch({ type: 'SET_WALLET_ADDRESS', payload: address });
    };
  // Function to connect to the Tron wallet
  const connectWallet = async () => {
    try {
      if (window.tronLink) {
        // Request TronLink to connect the wallet
        await window.tronLink.request({ method: 'tron_requestAccounts' });

        // Check if TronLink is connected and get the address
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          const address = window.tronWeb.defaultAddress.base58;
          setWalletAddress(address);

          console.log('Connected to Tron wallet:', address);
        } else {
          console.error('Tron wallet connection failed.');
        }
      } else {
        alert('Please install TronLink extension.');
      }
    } catch (error) {
      console.error('Connection to Tron wallet failed:', error);
    }
  };

  // Handle wallet address changes dynamically
  useEffect(() => {
    const handleAddressChange = () => {
      const newAddress = window.tronWeb.defaultAddress.base58;
      setWalletAddress(newAddress);
    };

    window.addEventListener('message', (e) => {
      if (e.data.message && e.data.message.action === 'setAccount') {
        handleAddressChange();
      }
    });

    return () => window.removeEventListener('message', handleAddressChange);
  }, []);

  return (
    <Box sx={{ textAlign: 'center'}}>
      {/* Display the connected wallet address */}
      <Typography variant="p" gutterBottom>
        {walletAddress ? `Connected Wallet Address: ${walletAddress}` : 'No Wallet Connected'}
      </Typography>

      {/* Button to trigger wallet connection */}
      <Button
        variant="contained"
        color="secondary"
        onClick={connectWallet}
      >
        {walletAddress ? 'Reconnect Wallet' : 'Connect Tron Wallet'}
      </Button>
    </Box>
  );
};

export default ConnectWallet;
