import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'style/style.css';
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from 'context/GlobalState';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
);

