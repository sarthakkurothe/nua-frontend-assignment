import React from 'react';
import './App.css';
import BookTable from './BookTable';

function App() {
  return (
    <div className="App">
      <div className='container'>
      <h1 className="welcome-text">Welcome to Admin Dashboard - OpenLibrary </h1>
      </div>
      <BookTable />
    </div>
  );
}

export default App;


