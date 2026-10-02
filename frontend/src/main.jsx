import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Remove the HTML loading screen with a smooth fade-out
function removeLoader() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.transition = 'opacity 0.6s ease-out';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 600);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App onReady={removeLoader} />
  </React.StrictMode>
);
