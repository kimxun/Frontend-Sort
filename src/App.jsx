// src/App.jsx
import React from 'react';
import './App.css';
import MainLayout from './components/MainLayout';
import Visualizer from './components/Visualizer';
import CodeBlock from './components/CodeBlock';
import Complexity from './components/Complexity';

function App() {
  return (
    <MainLayout
      leftContent={
        <>
          <Visualizer />
          <CodeBlock />
        </>
      }
      rightContent={<Complexity />}
    />
  );
}

export default App;