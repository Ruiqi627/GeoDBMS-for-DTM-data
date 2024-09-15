// src/App.js
import React from 'react';
import './App.css';
import MapComponent from './components/map';
import Sidebar from './components/sidebar/sidebar';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Sidebar />
        <div className="content">
           <div className="header-container">
            <h1>The DTM data spatio-temporal management system</h1>
          </div>
          <MapComponent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
