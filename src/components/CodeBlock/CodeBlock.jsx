import React from 'react';
import './CodeBlock.css';

function CodeBlock() {
  const codeString = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}`;

  return (
    <div className="card code-card">
      <div className="code-header">
        <h3>Source Code</h3>
      </div>
      <pre>
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;