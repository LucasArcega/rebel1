import { getVersionSupportLabel, isVersionSelectable, type ChordVersion } from '@/entities/chord';
import { groupVersionsByInstrument } from '../lib/group-versions';
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
  const groups = groupVersionsByInstrument(versions);

  if (!groups.length) return null;

  return (
    <div className="version-selector">
      <span className="version-selector__label">Nesta música</span>
      <div className="version-selector__groups">
        {groups.map((group) => (
          <div key={group.instrumentSlug} className="version-selector__group">
            <span className="version-selector__instrument">{group.instrument}</span>
            <div className="version-selector__list">
              {group.versions.map((version) => {
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
                    {version.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
