import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './utils/store';
import './index.css'

import { Buffer } from 'buffer';
// Polyfill Buffer
window.Buffer = Buffer;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
