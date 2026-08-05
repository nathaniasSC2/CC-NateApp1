import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GameWidget from './components/GameWidget';
import './App.css';

// Widget windows load the same bundle with a hash route: #/widget/<gameId>
const widgetMatch = window.location.hash.match(/^#\/?widget\/(\w+)/);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {widgetMatch ? <GameWidget gameId={widgetMatch[1]} /> : <App />}
  </React.StrictMode>
);
