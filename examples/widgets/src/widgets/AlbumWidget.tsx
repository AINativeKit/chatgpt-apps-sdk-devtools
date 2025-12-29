import { useState } from 'react';
import { useOpenAiGlobal, Album, Skeleton, Alert, type AlbumType } from '@ainativekit/ui';

interface AlbumData {
  type: string;
  albums?: AlbumType[];
  totalCount?: number;
  message?: string;
  error?: string;
}

function AlbumWidget() {
  const toolOutput = useOpenAiGlobal('toolOutput') as AlbumData | null;
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | null>(null);

  // Loading state
  if (!toolOutput) {
    return (
      <div className="py-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
          Photo Albums
        </h2>
        <div className="flex gap-4 px-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={180} height={240} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (toolOutput.error) {
    return (
      <div className="p-5">
        <Alert color="danger" variant="soft" title="Error" description={toolOutput.error} />
      </div>
    );
  }

  // Empty state
  if (!toolOutput.albums?.length) {
    return (
      <div className="py-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
          Photo Albums
        </h2>
        <div className="px-5">
          <Alert
            color="info"
            variant="soft"
            title="No Albums"
            description={toolOutput.message || 'No photo albums to display'}
          />
        </div>
      </div>
    );
  }

  const { albums, totalCount } = toolOutput;

  return (
    <div className="py-5">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
        Photo Albums
      </h2>

      <Album
        albums={albums}
        selectedAlbum={selectedAlbum}
        onAlbumSelect={setSelectedAlbum}
        align="center"
        showNavigation
        flushStart
      />

      {totalCount !== undefined && (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)] px-5">
          {totalCount} album{totalCount !== 1 ? 's' : ''} available
        </p>
      )}
    </div>
  );
}

export default AlbumWidget;
