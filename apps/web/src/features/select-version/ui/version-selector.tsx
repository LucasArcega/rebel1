import { getVersionSupportLabel, isVersionSelectable, type ChordVersion } from '@/entities/chord';
import { useVersionNavigation } from '../model/use-version-navigation';

interface VersionSelectorProps {
  artistSlug: string;
  songSlug: string;
  versions: ChordVersion[];
  activeVersionId: number;
}

export const VersionSelector = ({
  artistSlug,
  songSlug,
  versions,
  activeVersionId,
}: VersionSelectorProps) => {
  const { selectVersion } = useVersionNavigation(artistSlug, songSlug);

  if (versions.length <= 1) return null;

  return (
    <div className="version-selector">
      <span className="version-selector__label">Versões</span>
      <div className="version-selector__list">
        {versions.map((version) => {
          const selectable = isVersionSelectable(version);
          const supportLabel = getVersionSupportLabel(version);

          return (
            <button
              key={version.id}
              type="button"
              disabled={!selectable}
              title={supportLabel}
              className={`version-chip ${version.id === activeVersionId ? 'version-chip--active' : ''} ${selectable ? '' : 'version-chip--disabled'}`}
              onClick={() => selectVersion(version)}
            >
              {version.instrument} · {version.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
