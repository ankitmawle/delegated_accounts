import { useState } from 'react'
import reactLogo from './assets/react.svg'
import icon from '/icon.svg'
import './App.css'
import ConnectAndSend from './components/tron'
import NavBar from './components/navbar'
import AccountTabs from './components/account'
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create the theme with custom primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Set primary color to black
    },
    secondary: {
      main: '#ffffff', // Set secondary color to white (for buttons, etc.)
    },
    text: {
      primary: '#ffffff', // Set text color to white
      secondary: '#000000', // Set secondary text color to black (for contrast)
    },
  },
});
function App() {

  return (
    <>
    <ThemeProvider theme={theme}>
      <NavBar></NavBar>
      
      <h1>Delegated Accounts and Cypto Plastic Money</h1>

      <AccountTabs />
      
      
      </ThemeProvider>
    </>
  )
}

export default App
