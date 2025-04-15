// src/App.js
import React from 'react';
import AuthProvider from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <div className="font-sans">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;