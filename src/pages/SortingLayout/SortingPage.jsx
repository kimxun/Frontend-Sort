import React from 'react';
import SortingLayout from './SortingLayout';
import '../../index.css'; 

export default function SortingPage({ darkMode, onToggleTheme }) {
  return (
    <div className="app-container dark">
      <SortingLayout darkMode={darkMode} onToggleTheme={onToggleTheme} />
    </div>
  );
}
