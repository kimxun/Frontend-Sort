import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './CodePanel.css';

const TOKEN_COLORS = [
  [/\b(void|int|for|if|swap|while|do|return|let|const|function)\b/g, "#c084fc"], 
  [/\b(a|N|i|j|min|max|min_idx|pivot|pivot_idx|x|l|r|arr|steps_history)\b/g, "#93c5fd"], 
  [/\b(\d+)\b/g, "#fbbf24"], 
  [/"[^"]*"|'[^']*'/g, "#86efac"], 
];

function getCodeForOrder(code, slug, sortOrder) {
  if (sortOrder === "asc") return code;

  if (slug === "selection-sort") {
    return code
      .replace(/\bmin\b/g, "max")
      .replace(/a\[j\]\s*<\s*a\[max\]/g, "a[j] > a[max]");
  }

  if (slug === "interchange-sort") {
    return code.replace(
      /a\[i\]\s*>\s*a\[j\]/g,
      "a[i] < a[j]"
    );
  }

  if (slug === "quick-sort") {
    return code
      .replace(/a\[i\]\s*<\s*x/g, "a[i] > x")
      .replace(/a\[j\]\s*>\s*x/g, "a[j] < x");
  }

  return code;
}

function highlight(line) {
  if (!line.trim()) return line;
  
  const parts = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = null;

    for (const [regex, color] of TOKEN_COLORS) {
      regex.lastIndex = 0;
      const m = regex.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = {
          index: m.index,
          match: m[0],
          color
        };
      }
    }

    if (!earliest) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (earliest.index > 0) {
      parts.push(
        <span key={key++}>
          {remaining.slice(0, earliest.index)}
        </span>
      );
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

const CodePanel = () => {
  const { algorithmInfo, steps, currentStep, sortOrder } = useSorting();

  const code = getCodeForOrder(
    algorithmInfo?.code || '',
    algorithmInfo?.slug,
    sortOrder
  );
  const lines = code.split('\n');
  const label = algorithmInfo?.name || 'Algorithm';

  const currentLine = steps[currentStep]?.line || 0;

  return (
    <div className="code-panel">
      <div className="code-header">{label}</div>
      <div className="code-container">
        {lines.map((line, i) => {
          const lineNumber = i + 1;
          const isActive = lineNumber === currentLine;

          return (
            <div
              key={i}
              className={`code-line ${isActive ? 'active' : ''}`}
            >
              <span
                className="line-number"
                data-active={isActive}
              >
                {lineNumber}
              </span>

              <span className="code-text">
                {highlight(line)}
              </span>

              {isActive && (
                <span className="executing-indicator">
                  ◀ executing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodePanel;
