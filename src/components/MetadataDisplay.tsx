interface MetadataDisplayProps {
  track: {
    number: number;
    name: string;
    duration: string | null;
    genre: string | null;
    bitrate: number | null;
    codec: string | null;
    year: number | null;
  };
}

export function MetadataDisplay({ track }: MetadataDisplayProps) {
  const fields = [
    ['Track', `${track.number}. ${track.name}`],
    ['Duration', track.duration],
    ['Genre', track.genre],
    ['Year', track.year],
    ['Bitrate', track.bitrate ? `${track.bitrate} kbps` : null],
    ['Codec', track.codec],
  ].filter(([, v]) => v != null);

  return (
    <dl className="grid grid-cols-2 gap-2 text-left">
      {fields.map(([label, value]) => (
        <div key={label as string}>
          <dt className="text-text-muted text-sm">{label}</dt>
          <dd className="text-text font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
