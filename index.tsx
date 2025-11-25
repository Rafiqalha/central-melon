import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import

const GOOGLE_CLIENT_ID = "733270710780-ql2tf8lgsu9m24f4i0hk7tne5kb84t41.apps.googleusercontent.com"; // Samakan dengan Backend

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);