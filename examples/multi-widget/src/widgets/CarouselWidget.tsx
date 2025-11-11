import React from 'react';
import { useGlobals } from '@ainativekit/ui';

function CarouselWidget() {
  const globals = useGlobals();
  const data = globals?.toolOutput;

  if (!data || !data.restaurants) {
    if (data?.message) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          {data.message}
        </div>
      );
    }
    return <div>Loading restaurants...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2 style={{ marginBottom: '20px' }}>Restaurant Carousel</h2>
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        {data.restaurants.map((restaurant: any) => (
          <div
            key={restaurant.id}
            style={{
              minWidth: '250px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--ai-color-border-primary, #e0e0e0)',
              backgroundColor: 'var(--ai-color-bg-secondary, #f9f9f9)'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
              {restaurant.name}
            </h3>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
              {restaurant.cuisine}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              ⭐ {restaurant.rating}
            </p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Found {data.totalResults} restaurants in {data.location}
      </p>
    </div>
  );
}

export default CarouselWidget;