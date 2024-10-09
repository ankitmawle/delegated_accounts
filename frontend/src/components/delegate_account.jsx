// src/components/DelegateAccount.jsx
import React, { useState, useEffect } from 'react';
import { tronWeb } from '../utils/tronWebUtils';
import { Typography, Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';

import adminABI from '../assets/admin.json';
import delegatorABI from '../assets/delegator.json';
import delegator_bytecode from '../assets/delegator_bytecode.json';
import { useSelector, useDispatch } from 'react-redux';

const checkForDelegateAccount = async (walletAddress) => {
    // const tronWeb = tronWeb
    tronWeb.setAddress(walletAddress);
    const adminContractAddress = import.meta.env.VITE_REACT_APP_ADMIN_CONTRACT_ADDRESS;
    // Create a contract instance
    const contract = await tronWeb.contract(adminABI, adminContractAddress);
  
    try {
      // Call the get_owner_delegator function
      const delegatorAddress = await contract.get_delegator_account(walletAddress).call();
      console.log(delegatorAddress)
      return (delegatorAddress !== '0x0000000000000000000000000000000000000000', delegatorAddress); // Check if a valid address is returned
    } catch (error) {
      console.error('Error fetching delegate account:', error);
      return (false,0); // Default to no delegate account on error
    }
  };

  const sendUSDT = async (delegatorAddress, receiverAddress, amount) => {
    // const tronWeb = createTronWebInstance();
    const contract = await tronWeb.contract(delegatorABI, delegatorAddress);
    try {
      const result = await contract.delegated_transaction(receiverAddress, BigInt(amount)*(BigInt(10**6))).send();
      console.log('Transaction successful:', result);
      return result;
    } catch (error) {
      console.error('Error sending USDT:', error);
      throw error; // Rethrow error to handle it later
    }
  };

  // Function to get delegate info
  const getDelegateInfo = async (address, delegatorAddress) => {
    // const tronWeb = createTronWebInstance();
  
    const contract = await tronWeb.contract(delegatorABI, delegatorAddress);
    try {
      const info = await contract.get_delegate_info(address).call();
      return info; // This returns a tuple
    } catch (error) {
      console.error(`Error fetching delegate info for ${address}:`, error);
      return null;
    }
  };
  
const DelegateAccount = () => {
  const [hasDelegateAccount, setHasDelegateAccount] = useState(null);
  const [delegateInfoList, setDelegateInfoList] = useState([]);
  const [delegator_address, setDelegatorAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);

  const walletAddress = useSelector((state) => state.wallet.address);
  // Sample function to simulate checking for a delegate account (replace with actual logic)
  useEffect(() => {
    if (!walletAddress) {
      return;
    }
    const fetchDelegateAccountStatus = async () => {
    var status,delegator_address = await checkForDelegateAccount(walletAddress);
    console.log("ss", status,delegator_address)
    if (delegator_address && delegator_address !== '410000000000000000000000000000000000000000'){
        setDelegatorAddress(delegator_address);
        setHasDelegateAccount(true);
    }else{
        setHasDelegateAccount(false);
    }
      
      setLoading(false);
    };

    fetchDelegateAccountStatus();
  }, [walletAddress]);

  useEffect(() => {
    const fetchDelegates = async () => {
      if (hasDelegateAccount) {

        const infoList = [await getDelegateInfo(walletAddress, tronWeb.address.fromHex(delegator_address))];
        setDelegateInfoList(infoList);
       console.log(infoList)
      }
    };

    fetchDelegates();
  }, [hasDelegateAccount]);


  const handleSendUSDT = async () => {
    try {
      const result = await sendUSDT(delegator_address,receiver, amount);
      alert('USDT sent successfully. Transaction ID: ' + result.txID);
    } catch (error) {
      alert('Error sending USDT: ' + error.message);
    }
  };
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5">Delegate Account</Typography>

      {loading ? (
        <Typography>Loading account information...</Typography>
      ) : hasDelegateAccount ? (
        <Box>
          <Typography variant="h6" color="green">
            Delegate Account is available.
          </Typography>
         
          <Card 
            style={{
              backgroundColor: 'black', 
              borderColor: 'white', 
              color: 'white', 
              margin: '20px 0', 
              padding: '20px', 
              borderWidth: 1,
              borderStyle: 'solid'
            }}
          >
            <CardContent>
              <Typography variant="h6">Send USDT</Typography>
              <TextField
                label="Receiver Address"
                variant="outlined"
                fullWidth
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                style={{ marginBottom: '10px', color: 'white' }}
                InputLabelProps={{
                  style: { color: 'white' }, // Change label color to white
                }}
                InputProps={{
                  style: { color: 'white' }, // Change input text color to white
                }}
              />
              <TextField
                label="Amount in USDT"
                type="number"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginBottom: '10px', color: 'white' }}
                InputLabelProps={{
                  style: { color: 'white' }, // Change label color to white
                }}
                InputProps={{
                  style: { color: 'white' }, // Change input text color to white
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSendUSDT}
                style={{ backgroundColor: 'white', color: 'black' }}
                InputLabelProps={{
                  style: { color: 'white' }, // Change label color to white
                }}
                InputProps={{
                  style: { color: 'white' }, // Change input text color to white
                }}
              >
                Send USDT
              </Button>
            </CardContent>
          </Card>
          <Typography variant="h6">Delegate Info:</Typography>
          <Grid container spacing={2}>
            {delegateInfoList.map((info, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined"   
                sx={{ 
                    backgroundColor: '#000000aa', 
                    borderColor: 'white', 
                    boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)', 
                    color: 'white' // Set text color to white
                }}>
                  <CardContent>
                    <Typography variant="h6">Name:- {info["name"]} </Typography>
                    <Typography>Is Restricted: {info[0] ? 'Yes' : 'No'}</Typography>
                    <Typography>Address: {tronWeb.address.fromHex(info["delegate"])}</Typography>
                    <Typography>Transaction Limit: {(info["transaction_limit"]/BigInt(10 ** 6)).toString()} USDT</Typography>
                    <Typography>Daily Amount: {(info["daily_amount"]/BigInt(10 ** 6)).toString()} USDT</Typography>
                    <Typography>Daily Transactions: {(info["daily_transactions"]/BigInt(10 ** 6)).toString()} USDT</Typography>
                    <Typography>Last Timestamp: {info["last_timestamp"].toString()} s</Typography>
                    <Typography>Today Spent: {(info["today_spent"]/BigInt(10 ** 6)).toString()} USDT</Typography>
                    <Typography>Today Transactions: {(info["today_transctions"]/BigInt(10 ** 6)).toString()} USDT</Typography>
                    <Typography>Transaction Delay: {info["transastion_delay"].toString()} s</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
         
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" color="red">
            Account is not registered as delegate account
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default DelegateAccount;
