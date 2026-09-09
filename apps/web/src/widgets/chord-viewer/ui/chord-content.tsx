import type { RefObject } from 'react';
import type { FontSize } from '@/features/chord-display';

interface ChordContentProps {
  content: string;
  contentRef?: RefObject<HTMLPreElement | null>;
  fontSize?: FontSize;
}

export const ChordContent = ({ content, contentRef, fontSize = 'md' }: ChordContentProps) => (
  <pre ref={contentRef} className={`chord-content chord-content--${fontSize}`} id="chord-print-area">
    {content}
  </pre>
);
