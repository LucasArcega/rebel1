import { Fragment } from 'react';
import type { RefObject } from 'react';
import type { FontSize } from '@/features/chord-display';
import {
  cleanChordContent,
  isSectionHeaderLine,
  splitChordLine,
} from '@/shared/lib/chord-highlight';

interface ChordContentProps {
  content: string;
  contentRef?: RefObject<HTMLDivElement | null>;
  fontSize?: FontSize;
}

const renderLineSegments = (line: string) =>
  splitChordLine(line).map((segment, index) =>
    segment.type === 'chord' ? (
      <span key={index} className="chord-token">
        {segment.value}
      </span>
    ) : (
      <Fragment key={index}>{segment.value}</Fragment>
    ),
  );

export const ChordContent = ({ content, contentRef, fontSize = 'md' }: ChordContentProps) => {
  const lines = cleanChordContent(content).split('\n');

  return (
    <div ref={contentRef} className="chord-content-area">
      <div className={`chord-content chord-content--${fontSize}`} id="chord-print-area">
        {lines.map((line, index) => {
          if (!line.trim()) {
            return <div key={index} className="chord-line chord-line--spacer" aria-hidden="true" />;
          }

          if (isSectionHeaderLine(line)) {
            return (
              <div key={index} className="chord-line chord-line--section">
                {line.trim()}
              </div>
            );
          }

          return (
            <div key={index} className="chord-line">
              {renderLineSegments(line)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
