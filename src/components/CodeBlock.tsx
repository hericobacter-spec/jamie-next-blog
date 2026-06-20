"use client";
import React, { useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

type Props = {
  children: string;
  className?: string;
};

export default function CodeBlock({ children, className }: Props) {
  const language = (className?.replace(/language-/, '') || 'text') as any;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div style={{ position: 'relative', margin: '20px 0', borderRadius: 'var(--radius-card, 28px)', overflow: 'hidden' }}>
      <Highlight {...defaultProps} theme={theme} code={children.trim()} language={language}>
        {({ className: innerClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={innerClass}
            style={{
              ...style,
              padding: '24px',
              overflowX: 'auto',
              margin: 0,
              borderRadius: 'var(--radius-card, 28px)',
              fontSize: '14px',
              lineHeight: 1.6,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            }}
          >
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                <div key={i} {...lineProps} style={{ ...lineProps.style, display: 'table-row' }}>
                  <span style={{ display: 'table-cell', textAlign: 'right', paddingRight: '16px', userSelect: 'none', opacity: 0.5, minWidth: '2.5em' }}>
                    {i + 1}
                  </span>
                  <span style={{ display: 'table-cell' }}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          padding: '6px 12px',
          fontSize: 12,
          border: 'none',
          borderRadius: 'var(--radius-button, 999px)',
          background: 'rgba(255,255,255,0.1)',
          color: '#ffffff',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.15s ease',
        }}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}
