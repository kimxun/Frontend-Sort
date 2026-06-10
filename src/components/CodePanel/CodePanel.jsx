import React from 'react';
import './CodePanel.css';

const codes = {
  selection: {
    label: "selectionSort.js",
    lines: [
      "function selectionSort(arr) {",
      "  for (let i = 0; i < arr.length - 1; i++) {",
      "    let minIdx = i;",
      "    for (let j = i + 1; j < arr.length; j++) {",
      "      if (arr[j] < arr[minIdx])",
      "        minIdx = j;",
      "    }",
      "    if (minIdx !== i)",
      "      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];",
      "  }",
      "  return arr;",
      "}",
    ],
  },
  interchange: {
    label: "interchangeSort.js",
    lines: [
      "function interchangeSort(arr) {",
      "  for (let i = 0; i < arr.length - 1; i++) {",
      "    for (let j = i + 1; j < arr.length; j++) {",
      "      if (arr[i] > arr[j])",
      "        [arr[i], arr[j]] = [arr[j], arr[i]];",
      "    }",
      "  }",
      "  return arr;",
      "}",
    ],
  },
  quick: {
    label: "quickSort.js",
    lines: [
      "function quickSort(arr, l, r) {",
      "  if (l < r) {",
      "    let p = partition(arr, l, r);",
      "    quickSort(arr, l, p - 1);",
      "    quickSort(arr, p + 1, r);",
      "  }",
      "}",
      "",
      "function partition(arr, l, r) {",
      "  let pivot = arr[r], i = l - 1;",
      "  for (let j = l; j < r; j++) {",
      "    if (arr[j] <= pivot) {",
      "      i++;",
      "      [arr[i], arr[j]] = [arr[j], arr[i]];",
      "    }",
      "    [arr[i+1], arr[r]] = [arr[r], arr[i+1]];",
      "    return i + 1;",
      "  }",
      "}",
    ],
  },
};

const TOKEN_COLORS = [
  [/\b(function|return|for|let|const|if)\b/g, "#c084fc"],
  [/\b(arr|minIdx|pivot|i|j|p|l|r)\b/g, "#93c5fd"],
  [/\b(\d+)\b/g, "#fbbf24"],
  [/"[^"]*"|'[^']*'/g, "#86efac"],
];

function highlight(line) {
  const parts = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = null;
    for (const [regex, color] of TOKEN_COLORS) {
      regex.lastIndex = 0;
      const m = regex.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m[0], color };
      }
    }
    if (!earliest) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (earliest.index > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, earliest.index)}</span>);
    }
    parts.push(
      <span key={key++} style={{ color: earliest.color }}>
        {earliest.match}
      </span>
    );
    remaining = remaining.slice(earliest.index + earliest.match.length);
  }
  return parts;
}

const CodePanel = ({ algorithm, currentLine }) => {
  const { label, lines } = codes[algorithm] ?? codes.selection;

  return (
    <div className="code-panel">
     
    

    
      <div className="code-container">
        {lines.map((line, i) => {
          const isActive = i === currentLine;
          return (
            <div key={i} className={`code-line ${isActive ? 'active' : ''}`}>
              <span className="line-number" data-active={isActive}>
                {i + 1}
              </span>
              <span className="code-text">
                {isActive && line.trim() ? highlight(line) : line}
              </span>
              {isActive && <span className="executing-indicator">◀ executing</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodePanel;