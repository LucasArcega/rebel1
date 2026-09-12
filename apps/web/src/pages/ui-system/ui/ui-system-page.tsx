import { findFingerings } from '@cifra-hub/shared';
import { ChordDiagram } from '@/entities/chord-diagram';
import {
  Button,
  Dialog,
  IconButton,
  Inline,
  Popover,
  Select,
  Slider,
  Stack,
  Surface,
  Tooltip,
} from '@/shared/ui';
import { FingeringPicker } from '@/features/select-chord-fingering';
import { useState } from 'react';

const fontItems = [
  { value: 'sm', label: 'Pequena' },
  { value: 'md', label: 'Média' },
  { value: 'lg', label: 'Grande' },
] as const;

const EdgePreview = ({ label, side }: { label: string; side: 'top' | 'bottom' | 'left' | 'right' }) => (
  <div className={`ui-system-frame__edge ui-system-frame__edge--${side}`}>
    <Popover>
      <Popover.Trigger openOnHover delay={0} closeDelay={140} className="ui-button ui-button--secondary ui-button--compact">
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side={side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side}>
          <Popover.Popup role="group" aria-label={`Preview ${label}`}>
            Preview {label}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover>
  </div>
);

export const UiSystemPage = () => {
  const [fontSize, setFontSize] = useState<(typeof fontItems)[number]['value']>('md');
  const [bpm, setBpm] = useState(92);
  const [loading, setLoading] = useState(false);
  const compactFingerings = findFingerings('D9/F#');
  const manyFingerings = findFingerings('C');
  const compactFingering = compactFingerings[0];
  const manyFingering = manyFingerings[0];
  const [compactOpen, setCompactOpen] = useState(false);
  const [manyOpen, setManyOpen] = useState(false);

  return (
    <article className="page ui-system-page">
      <header className="page-header">
        <h1>Catálogo do design system</h1>
        <p className="page-header__subtitle">Estados determinísticos dos primitives e layouts. Rota apenas de desenvolvimento.</p>
      </header>

      <section className="ui-system-section">
        <h2>Button e IconButton</h2>
        <Inline>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="compact">Compact</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={() => setLoading((value) => !value)}>
            Loading
          </Button>
          <IconButton aria-label="Fechar exemplo" variant="secondary">×</IconButton>
        </Inline>
      </section>

      <section className="ui-system-section">
        <h2>Select e Slider</h2>
        <Inline align="end">
          <Select
            label="Fonte"
            value={fontSize}
            onValueChange={setFontSize}
            items={fontItems}
          />
          <Slider aria-label="BPM do catálogo" label="BPM" min={40} max={240} value={bpm} onValueChange={setBpm} />
        </Inline>
      </section>

      <section className="ui-system-section">
        <h2>Tooltip, Popover e Dialog</h2>
        <Inline>
          <Tooltip>
            <Tooltip.Trigger className="ui-button ui-button--secondary ui-button--compact">
              Dica
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>Somente texto descritivo</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip>

          <Popover>
            <Popover.Trigger className="ui-button ui-button--secondary ui-button--compact">
              Popover
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup>
                  <Popover.Title>Ação contextual</Popover.Title>
                  <Button variant="ghost" size="compact">Ação interna</Button>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover>

          <Dialog>
            <Dialog.Trigger className="ui-button ui-button--secondary ui-button--compact">
              Dialog
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup>
                  <Dialog.Title>Tarefa modal</Dialog.Title>
                  <Dialog.Description>O foco permanece no diálogo.</Dialog.Description>
                  <Dialog.Close className="ui-button ui-button--primary ui-button--compact" aria-label="Fechar diálogo">
                    Fechar
                  </Dialog.Close>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog>
        </Inline>
      </section>

      <section className="ui-system-section">
        <h2>Collision nas bordas</h2>
        <div className="ui-system-frame">
          <EdgePreview label="Topo" side="top" />
          <EdgePreview label="Base" side="bottom" />
          <EdgePreview label="Esquerda" side="left" />
          <EdgePreview label="Direita" side="right" />
        </div>
      </section>

      <section className="ui-system-section">
        <h2>Layouts</h2>
        <Stack gap={3}>
          <Surface>Surface base</Surface>
          <Surface tone="raised">Surface raised</Surface>
          <Inline>
            <span>Inline</span>
            <span>com</span>
            <span>tokens</span>
          </Inline>
        </Stack>
      </section>

      {compactFingering && (
        <section className="ui-system-section">
          <h2>Uma forma</h2>
          <Popover>
            <Popover.Trigger openOnHover delay={0} closeDelay={140} className="chord-token chord-token--previewable">
              D9/F#
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup role="group" aria-label="Diagrama e variações de D9/F#">
                  <ChordDiagram symbol="D9/F#" fingering={compactFingering} size="sm" />
                  <Button
                    variant="secondary"
                    size="compact"
                    aria-haspopup="dialog"
                    onClick={() => setCompactOpen(true)}
                  >
                    Ver detalhes
                  </Button>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover>
          {compactOpen && (
            <FingeringPicker
              symbol="D9/F#"
              fingerings={compactFingerings}
              selectedId={compactFingering.id}
              openerRef={{ current: null }}
              onClose={() => setCompactOpen(false)}
              onSelect={() => undefined}
            />
          )}
        </section>
      )}

      {manyFingering && (
        <section className="ui-system-section">
          <h2>Várias formas</h2>
          <Button variant="secondary" onClick={() => setManyOpen(true)}>
            Ver {manyFingerings.length} variações
          </Button>
          {manyOpen && (
            <FingeringPicker
              symbol="C"
              fingerings={manyFingerings}
              selectedId={manyFingering.id}
              openerRef={{ current: null }}
              onClose={() => setManyOpen(false)}
              onSelect={() => undefined}
            />
          )}
        </section>
      )}
    </article>
  );
};
