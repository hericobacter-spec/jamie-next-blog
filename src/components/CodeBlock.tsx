"use client";
import React, { useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

type Props = {
  children: string;
  className?: string;
};

export default function CodeBlock({ children, className }: Props) {
  const language = (className?.replace(/language-/, '') || 'js') as any;
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
    <div style={{ position: 'relative', margin: '1rem 0' }}>
      <Highlight {...defaultProps} theme={theme} code={children.trim()} language={language}>
        {({ className: innerClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={innerClass} style={{ ...style, padding: '1rem', overflowX: 'auto', borderRadius: 8, background:'var(--code-bg)', color:'var(--foreground)' }}>
            <button
              onClick={copy}
              style={{ position: 'absolute', right: 8, top: 8, padding: '6px 8px', fontSize: 12 }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
