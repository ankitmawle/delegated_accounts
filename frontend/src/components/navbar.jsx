// src/components/NavBar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ConnectWallet from './tron'; // Assuming this is your connect wallet component
import icon from '/icon.svg'
const NavBar = ({ onConnectWallet }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Logo on the left */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={icon} alt="Logo" style={{ width: '40px', marginRight: '16px' }} />
        </Box>



        {/* Wallet connect button on the right */}
        <Box>
          <ConnectWallet onConnectWallet={onConnectWallet} />
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
