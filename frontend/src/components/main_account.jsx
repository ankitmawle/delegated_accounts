// src/components/MainAccount.jsx
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
      const delegatorAddress = await contract.get_owner_delegator(walletAddress).call();
      console.log(delegatorAddress)
      return (delegatorAddress !== '0x0000000000000000000000000000000000000000', delegatorAddress); // Check if a valid address is returned
    } catch (error) {
      console.error('Error fetching delegate account:', error);
      return (false,0); // Default to no delegate account on error
    }
  };

  const deployDelegatorContract = async (walletAddress) => {
    if(true) {
        
        // tronWeb.setAddress(walletAddress);
      const transaction = await tronWeb.contract().new({
        abi: delegatorABI,
        bytecode: delegator_bytecode.object,
        parameters: [
            import.meta.env.VITE_REACT_APP_ADMIN_TOKEN_ADDRESS,
            import.meta.env.VITE_REACT_APP_ADMIN_CONTRACT_ADDRESS
        ],
        userFeePercentage: 0,
        originEnergyLimit: 1e7,
        feeLimit: 1000000000, // Optional: adjust the fee limit
        callValue: 0, // Adjust based on your needs
      });

      console.log('Contract deployed at:', transaction.address);
      return transaction.address;}
    // } catch (error) {
    //   console.error('Error deploying delegate contract:', error);
    //   throw error; // Rethrow error to handle it later
    // }
  };
  

  const callRegisterDelegateAccount = async (delegateData, delegateAddress) => {
    // const tronWeb = createTronWebInstance();
    const adminContractAddress = process.env.REACT_APP_ADMIN_CONTRACT_ADDRESS;
  
    const contract = await tronWeb.contract(delegatorABI, delegateAddress);
    try {
      const result = await contract.register_delegate(
        delegateData.name,
        delegateData.delegateAddress,
        delegateData.dailyTransactions,
        BigInt(delegateData.dailyAmount)*(BigInt(10**6)),
        delegateData.transactionDelay,
        BigInt(delegateData.transactionLimit)*(BigInt(10**6))
      ).send(); // Ensure this matches the contract function signature
      return result;
    } catch (error) {
      console.error('Error registering delegate account:', error);
    }
  };
  
  const fetchAllDelegates = async (delegatorAddress) => {
    // const tronWeb = createTronWebInstance();
    const adminContractAddress = import.meta.env.VITE_REACT_APP_ADMIN_CONTRACT_ADDRESS;
  
    const contract = await tronWeb.contract(delegatorABI, delegatorAddress);
    try {
      const delegateAddresses = await contract.get_all_delegate_addresses().call(); // Assumes this function exists
      return delegateAddresses;
    } catch (error) {
      console.error('Error fetching delegate addresses:', error);
      return [];
    }
  };
  
  // Function to get delegate info
  const getDelegateInfo = async (address, delegatorAddress) => {
    // const tronWeb = createTronWebInstance();
    const adminContractAddress = import.meta.env.VITE_REACT_APP_ADMIN_CONTRACT_ADDRESS;
  
    const contract = await tronWeb.contract(delegatorABI, delegatorAddress);
    try {
      const info = await contract.get_delegate_info(address).call();
      return info; // This returns a tuple
    } catch (error) {
      console.error(`Error fetching delegate info for ${address}:`, error);
      return null;
    }
  };
  
const MainAccount = () => {
  const [hasDelegateAccount, setHasDelegateAccount] = useState(null);
  const [delegateInfoList, setDelegateInfoList] = useState([]);
  const [delegator_address, setDelegatorAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delegateData, setDelegateData] = useState({
    name: '',
    delegateAddress: '',
    transactionLimit: '',
    dailyAmount: '',
    dailyTransactions: '',
    transactionDelay: ''
  });
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
        console.log("test",tronWeb.address.fromHex(delegator_address))
        const delegates = await fetchAllDelegates(tronWeb.address.fromHex(delegator_address));
        console.log("del",delegates);
        const infoList = await Promise.all(delegates.map((delegateAddress) => getDelegateInfo(delegateAddress, tronWeb.address.fromHex(delegator_address))));
        setDelegateInfoList(infoList);
       console.log(infoList)
      }
    };

    fetchDelegates();
  }, [hasDelegateAccount]);
  const handleCreateDelegatorAccount = async(walletAddress) => {
    // Logic to create a delegate account
    if (true) {
        const contractAddress = await deployDelegatorContract(delegateData);
        if (contractAddress) {
          alert('Delegate contract deployed successfully at: ' + contractAddress);
          // Optionally reset the delegateData state or refresh the list
        } else {
          alert('Failed to deploy delegate contract.');
        }}
    //   } catch (error) {
    //     alert('Error deploying delegate contract: ' + error.message);
    //   }
  };


  const registerDelegateAccount = async () => {
    const result = await callRegisterDelegateAccount(delegateData, tronWeb.address.fromHex(delegator_address));
    if (result) {
      alert('Delegate account registered successfully!');
      // Optionally reset the delegateData state or refresh the list
    } else {
      alert('Failed to register delegate account.');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5">Main Account</Typography>

      {loading ? (
        <Typography>Loading account information...</Typography>
      ) : hasDelegateAccount ? (
        <Box>
          <Typography variant="h6" color="green">
            Delegate Account is available.
          </Typography>
          <Typography variant="h6">Delegate Info:</Typography>
            {/* Card to Register New Delegate Account */}
 
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
          <Card 
            variant="outlined" 
            sx={{ 
              backgroundColor: 'black', 
              borderColor: 'white', 
              boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)', 
              marginBottom: '20px',
              color: 'white' // Set text color to white
            }}
          >
              <CardContent>
              <Typography variant="h6">Register New Delegate Account</Typography>
              <TextField
                label="Delegate Name"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter delegate name"
                InputLabelProps={{
                  style: { color: 'white' }, // Change label color to white
                }}
                InputProps={{
                  style: { color: 'white' }, // Change input text color to white
                }}
                value={delegateData.name}
                onChange={(e) => setDelegateData({ ...delegateData, name: e.target.value })}
              />
              <TextField
                label="Delegate Address"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter delegate address"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                value={delegateData.delegateAddress}
                onChange={(e) => setDelegateData({ ...delegateData, delegateAddress: e.target.value })}
              />
              <TextField
                label="Transaction Limit (n)"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter transaction limit"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                value={delegateData.transactionLimit}
                onChange={(e) => setDelegateData({ ...delegateData, transactionLimit: e.target.value })}
              />
              <TextField
                label="Daily Amount (n)"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter daily amount"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                value={delegateData.dailyAmount}
                onChange={(e) => setDelegateData({ ...delegateData, dailyAmount: e.target.value })}
              />
              <TextField
                label="Max Daily Transactions"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter daily transaction limit"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                value={delegateData.dailyTransactions}
                onChange={(e) => setDelegateData({ ...delegateData, dailyTransactions: e.target.value })}
              />
              <TextField
                label="Transaction Delay (seconds)"
                variant="outlined"
                fullWidth
                margin="normal"
                placeholder="Enter transaction delay in seconds"
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                value={delegateData.transactionDelay}
                onChange={(e) => setDelegateData({ ...delegateData, transactionDelay: e.target.value })}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={registerDelegateAccount}
                sx={{ marginTop: '10px' }}
              >
                Register Delegator Account
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" color="red">
            No Delegator Account found.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateDelegatorAccount}
          >
            Create Delegate Account
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default MainAccount;
