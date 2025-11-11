import React from 'react';
import { useGlobals } from '@ainativekit/ui';

function MapWidget() {
  const globals = useGlobals();
  const data = globals?.toolOutput;

  if (!data || !data.center) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2 style={{ marginBottom: '20px' }}>Location Map</h2>

      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          border: '1px solid var(--ai-color-border-primary, #e0e0e0)',
          backgroundColor: 'var(--ai-color-bg-secondary, #f0f0f0)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Mock map view */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#666'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            Map View
          </div>
          <div style={{ fontSize: '14px' }}>
            Center: {data.center.lat.toFixed(4)}, {data.center.lng.toFixed(4)}
          </div>
          <div style={{ fontSize: '14px' }}>
            Zoom: {data.zoom}
          </div>
        </div>

        {/* Markers */}
        {data.markers && data.markers.map((marker: any, index: number) => (
          <div
            key={marker.id}
            style={{
              position: 'absolute',
              top: `${30 + index * 15}%`,
              left: `${20 + index * 20}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50% 50% 50% 0',
                backgroundColor: '#ef4444',
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ transform: 'rotate(-45deg)', fontSize: '16px' }}>📍</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Locations ({data.markers?.length || 0})</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {data.markers?.map((marker: any) => (
            <li key={marker.id} style={{ marginBottom: '4px' }}>
              {marker.title} ({marker.lat.toFixed(4)}, {marker.lng.toFixed(4)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapWidget;