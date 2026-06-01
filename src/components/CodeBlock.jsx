//hien thi cong thuc thuat toan
import React from 'react';

function CodeBlock({ currentPseudo, activeLine }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Công Thức Thuật Toán (Mã Giả)</h3>
      <pre style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0, overflowX: 'auto', fontFamily: '"Courier New", monospace', fontSize: '13px', lineHeight: '1.6', textAlign: 'left' }}>
        {currentPseudo.map((line, index) => (
          <div key={index} style={{
            backgroundColor: index === activeLine ? '#3b82f6' : 'transparent',
            color: index === activeLine ? '#fff' : '#334155',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: index === activeLine ? 'bold' : 'normal'
          }}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export default CodeBlock;