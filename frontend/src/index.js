import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { configureStore } from './Redux/Store';
import { GoogleOAuthProvider } from '@react-oauth/google';
const { store, persistor } = configureStore();
if (typeof window !== 'undefined') {
  window.persistor = persistor;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId="740597259200-767dkgoh1htbm0njb2r6nk9soai53c85.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);

reportWebVitals();
