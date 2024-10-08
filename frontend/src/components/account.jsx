// src/components/AccountTabs.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import MainAccount from './main_account'; // Assuming this is your main account component
import DelegateAccount from './delegate_account';

// Function to render the content based on the selected tab
const TabContent = ({ value }) => {
  switch (value) {
    case 0:
      return <MainAccount />;
    case 1:
      return <DelegateAccount />;
    default:
      return null;
  }
};

const AccountTabs = () => {
  const [value, setValue] = useState(0); // Default selected tab

  const handleChange = (event, newValue) => {
    setValue(newValue); // Update the selected tab
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth" textColor="secondary">
        <Tab label="Main Account" />
        <Tab label="Delegate Account" />
      </Tabs>
      <TabContent value={value} />
    </Box>
  );
};

export default AccountTabs;
