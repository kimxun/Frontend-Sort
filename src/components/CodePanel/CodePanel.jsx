import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './CodePanel.css';

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

      if (
        m &&
        (
          earliest === null ||
          m.index < earliest.index
        )
      ) {
        earliest = {
          index: m.index,
          match: m[0],
          color
        };
      }
    }

    if (!earliest) {

      parts.push(
        <span key={key++}>
          {remaining}
        </span>
      );

      break;
    }

    if (earliest.index > 0) {

      parts.push(
        <span key={key++}>
          {
            remaining.slice(
              0,
              earliest.index
            )
          }
        </span>
      );
    }

    parts.push(
      <span
        key={key++}
        style={{
          color: earliest.color
        }}
      >
        {earliest.match}
      </span>
    );

    remaining = remaining.slice(
      earliest.index +
      earliest.match.length
    );
  }

  return parts;
}

const CodePanel = () => {

  const {
    algorithmInfo,
    currentStep
  } = useSorting();

  const code =
    algorithmInfo?.code || '';

  const lines = code.split('\n');

  const label =
    algorithmInfo?.name ||
    'Algorithm';

  const currentLine =
    currentStep || 0;

  return (
    <div className="code-panel">

      <div className="code-header">
        {label}
      </div>

      <div className="code-container">

        {lines.map((line, i) => {

          const isActive =
            i === currentLine;

          return (

            <div
              key={i}
              className={
                `code-line ${
                  isActive
                    ? 'active'
                    : ''
                }`
              }
            >

              <span
                className="line-number"
                data-active={isActive}
              >
                {i + 1}
              </span>

              <span className="code-text">

                {
                  isActive &&
                  line.trim()
                    ? highlight(line)
                    : line
                }

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