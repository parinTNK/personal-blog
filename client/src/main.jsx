import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/UserContext.jsx' // Import UserProvider
import { Toaster } from 'react-hot-toast' // Import Toaster

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* เพิ่ม UserProvider ครอบ App */}
      <Toaster position='bottom-right'/> {/* เพิ่ม Toaster */}
      <App />
    </UserProvider>
  </React.StrictMode>,
)
