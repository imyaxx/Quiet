import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { MOUNT_ERROR } from './constants';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(MOUNT_ERROR);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
