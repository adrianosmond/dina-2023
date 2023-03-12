import React from 'react';
import { createRoot } from 'react-dom/client';
import './style/style.css';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('No root found!');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
