// src/utils/tronWebUtils.js
import {TronWeb} from 'tronweb';

// Setting up TronWeb (Mainnet or Shasta Testnet)
const TRON_FULL_NODE = 'https://api.shasta.trongrid.io';
const TRON_SOLIDITY_NODE = 'https://api.shasta.trongrid.io';
const TRON_EVENT_SERVER = 'https://api.shasta.trongrid.io';



export const tronWeb = new TronWeb(
  TRON_FULL_NODE,
  TRON_SOLIDITY_NODE,
  TRON_EVENT_SERVER
);

export const connectToTronWallet = async () => {
  // Check if TronLink is installed
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    const address = window.tronWeb.defaultAddress.base58;
    console.log('Connected to Tron wallet:', address);
    return address;
  } else {
    console.log('TronLink is not installed or wallet is not connected.');
    return null;
  }
};

export const sendTrx = async (toAddress, amount) => {
    try {
      const transaction = await tronWeb.trx.sendTransaction(
        toAddress, 
        tronWeb.toSun(amount) // Convert to Sun (smallest unit)
      );
      console.log('Transaction Success:', transaction);
    } catch (error) {
      console.error('Transaction Failed:', error);
    }
  };