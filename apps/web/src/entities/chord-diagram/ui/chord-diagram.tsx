import { useId } from 'react';
import type { ChordFingering } from '@cifra-hub/shared';

export interface ChordDiagramProps {
  symbol: string;
  fingering: ChordFingering;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
}

const STRING_NAMES = ['E grave', 'A', 'D', 'G', 'B', 'E aguda'];
const STRING_X = [20, 40, 60, 80, 100, 120];
const GRID_TOP = 32;
const FRET_HEIGHT = 22;

const describeFingering = (fingering: ChordFingering) =>
  fingering.frets
    .map((fret, index) => {
      const position = fret === 'x' ? 'abafada' : fret === 0 ? 'solta' : `casa ${fret}`;
      return `${STRING_NAMES[index]} ${position}`;
    })
    .join(', ');

const stringX = (stringNumber: number) => STRING_X[6 - stringNumber] ?? STRING_X[0];

export const ChordDiagram = ({
  symbol,
  fingering,
  size = 'md',
  showTitle = true,
}: ChordDiagramProps) => {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '-');
  const titleId = `chord-diagram-${fingering.id.replace(/[^a-zA-Z0-9_-]/g, '-')}-${instanceId}`;
  const description = describeFingering(fingering);

  return (
    <figure className={`chord-diagram chord-diagram--${size}`} data-slot="chord-diagram">
      {showTitle && <figcaption className="chord-diagram__title">{symbol}</figcaption>}
      <svg
        className="chord-diagram__svg"
        viewBox="0 0 140 154"
        role="img"
        aria-labelledby={`${titleId}-title ${titleId}-description`}
      >
        <title id={`${titleId}-title`}>{`Diagrama de ${symbol}`}</title>
        <desc id={`${titleId}-description`}>{description}</desc>

        {fingering.baseFret > 1 && (
          <text className="chord-diagram__base-fret" x="4" y="48">
            {fingering.baseFret}ª
          </text>
        )}

        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={`string-${index}`}
            className="chord-diagram__string"
            x1={STRING_X[index]}
            x2={STRING_X[index]}
            y1={GRID_TOP}
            y2={GRID_TOP + FRET_HEIGHT * 5}
          />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={`fret-${index}`}
            className={index === 0 && fingering.baseFret === 1
              ? 'chord-diagram__fret chord-diagram__nut'
              : 'chord-diagram__fret'}
            x1={STRING_X[0]}
            x2={STRING_X[5]}
            y1={GRID_TOP + FRET_HEIGHT * index}
            y2={GRID_TOP + FRET_HEIGHT * index}
          />
        ))}

        {fingering.barres.map((barre, index) => {
          const y = GRID_TOP + (barre.fret - fingering.baseFret + 0.5) * FRET_HEIGHT;
          return (
            <line
              key={`${barre.fret}-${barre.fromString}-${barre.toString}-${index}`}
              className="chord-diagram__barre"
              x1={stringX(barre.fromString)}
              x2={stringX(barre.toString)}
              y1={y}
              y2={y}
            />
          );
        })}

        {fingering.frets.map((fret, index) => {
          if (fret === 'x' || fret === 0) {
            return (
              <text
                key={`marker-${index}`}
                className="chord-diagram__marker"
                x={STRING_X[index]}
                y="20"
                textAnchor="middle"
              >
                {fret === 'x' ? '×' : '○'}
              </text>
            );
          }

          const y = GRID_TOP + (fret - fingering.baseFret + 0.5) * FRET_HEIGHT;
          const finger = fingering.fingers[index];
          return (
            <g key={`finger-${index}`} className="chord-diagram__finger">
              <circle cx={STRING_X[index]} cy={y} r="8" />
              {finger !== 0 && (
                <text x={STRING_X[index]} y={y + 3.5} textAnchor="middle">
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
};
