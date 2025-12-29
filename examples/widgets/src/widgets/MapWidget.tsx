import { useState } from 'react';
import { useOpenAiGlobal, Map, FullscreenMap, Skeleton, Alert, type LocationData } from '@ainativekit/ui';

interface MapData {
  type: string;
  locations?: LocationData[];
  center?: { lat: number; lng: number };
  zoom?: number;
  message?: string;
  error?: string;
}

function MapWidget() {
  const toolOutput = useOpenAiGlobal('toolOutput') as MapData | null;
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Loading state
  if (!toolOutput) {
    return (
      <div className="p-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Pizza Map
        </h2>
        <Skeleton width="100%" height={400} />
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
  if (!toolOutput.locations?.length) {
    return (
      <div className="p-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          Pizza Map
        </h2>
        <Alert
          color="info"
          variant="soft"
          title="No Locations"
          description={toolOutput.message || 'No locations to display'}
        />
      </div>
    );
  }

  const { locations, center, zoom } = toolOutput;
  const defaultCenter: [number, number] = center ? [center.lat, center.lng] : [37.7749, -122.4194];

  // When fullscreen, render in a fixed position overlay that takes up the entire viewport
  if (isFullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, overflow: 'auto' }}>
          <FullscreenMap
            locations={locations}
            selectedId={selectedId}
            onLocationSelect={(id) => setSelectedId(id)}
            onCollapse={() => setIsFullscreen(false)}
            defaultCenter={defaultCenter}
            defaultZoom={zoom || 12}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Pizza Map
      </h2>

      <div
        style={{
          width: '100%',
          height: '478px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--elevation-2-shadow)',
        }}
      >
        <Map
          locations={locations}
          selectedId={selectedId}
          onLocationSelect={(id) => setSelectedId(id)}
          defaultCenter={defaultCenter}
          defaultZoom={zoom || 12}
          isFullscreen={isFullscreen}
          onToggleFullscreen={setIsFullscreen}
          markerVariant="hybrid"
        />
      </div>

      <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
        {locations.length} pizza places in San Francisco
      </p>
    </div>
  );
}

export default MapWidget;
