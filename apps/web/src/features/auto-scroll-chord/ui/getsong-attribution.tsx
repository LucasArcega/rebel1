interface GetsongAttributionProps {
  visible: boolean;
}

export const GetsongAttribution = ({ visible }: GetsongAttributionProps) => {
  if (!visible) {
    return null;
  }

  return (
    <p className="getsong-attribution">
      BPM via{' '}
      <a href="https://getsongbpm.com" target="_blank" rel="noreferrer">
        GetSongBPM
      </a>
    </p>
  );
};
