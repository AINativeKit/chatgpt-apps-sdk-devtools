import React from 'react';
import { useGlobals } from '@ainativekit/ui';

function SearchWidget() {
  const globals = useGlobals();
  const data = globals?.toolOutput;

  if (!data || !data.type) {
    return <div>Loading search results...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2 style={{ marginBottom: '20px' }}>Search Results</h2>

      {data.query && (
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--ai-color-bg-secondary, #f9f9f9)',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#666' }}>Searching for: </span>
          <strong>{data.query}</strong>
        </div>
      )}

      {data.results && data.results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.results.map((result: any) => (
            <div
              key={result.id}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--ai-color-border-primary, #e0e0e0)',
                backgroundColor: 'var(--ai-color-bg-primary, #fff)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#1a73e8' }}>
                {result.title}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                {result.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#666',
          backgroundColor: 'var(--ai-color-bg-secondary, #f9f9f9)',
          borderRadius: '8px'
        }}>
          {data.message || 'No results found'}
        </div>
      )}

      {data.totalCount !== undefined && (
        <p style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'center'
        }}>
          {data.totalCount === 0
            ? 'No results found'
            : `Showing ${data.results?.length || 0} of ${data.totalCount} results`}
        </p>
      )}
    </div>
  );
}

export default SearchWidget;