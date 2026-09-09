interface ChordContentProps {
  content: string;
}

export const ChordContent = ({ content }: ChordContentProps) => (
  <pre className="chord-content">{content}</pre>
);
