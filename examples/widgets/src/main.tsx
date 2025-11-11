import React from 'react';
import ReactDOM from 'react-dom/client';
import { DevContainer, createMockData } from '@ainativekit/devtools';
import { ThemeProvider } from '@ainativekit/ui';

// Import example widgets
import CarouselWidget from './widgets/CarouselWidget';
import MapWidget from './widgets/MapWidget';
import SearchWidget from './widgets/SearchWidget';

// Mock data for restaurants
const restaurantData = createMockData(
  {
    type: 'restaurant-list',
    restaurants: [
      { id: 1, name: 'The Italian Place', cuisine: 'Italian', rating: 4.5 },
      { id: 2, name: 'Sushi Master', cuisine: 'Japanese', rating: 4.8 },
      { id: 3, name: 'Burger Joint', cuisine: 'American', rating: 4.2 },
      { id: 4, name: 'Thai Garden', cuisine: 'Thai', rating: 4.6 },
      { id: 5, name: 'La Brasserie', cuisine: 'French', rating: 4.7 }
    ],
    totalResults: 5,
    location: 'San Francisco, CA'
  },
  {
    emptyTransform: (data) => ({
      ...data,
      restaurants: [],
      totalResults: 0,
      message: 'No restaurants found in your area'
    })
  }
);

// Mock data for map locations
const locationData = {
  center: { lat: 37.7749, lng: -122.4194 },
  zoom: 12,
  markers: [
    { id: 1, lat: 37.7749, lng: -122.4194, title: 'Downtown SF' },
    { id: 2, lat: 37.7849, lng: -122.4094, title: 'North Beach' },
    { id: 3, lat: 37.7649, lng: -122.4294, title: 'Mission District' }
  ]
};

// Mock data for search results
const searchData = createMockData(
  {
    type: 'search-results',
    query: 'coffee shops',
    results: [
      { id: 1, title: 'Blue Bottle Coffee', description: 'Artisan coffee roaster' },
      { id: 2, title: 'Starbucks', description: 'Popular coffee chain' },
      { id: 3, title: 'Philz Coffee', description: 'Custom blended coffee' }
    ],
    totalCount: 3
  },
  {
    emptyData: {
      type: 'search-results',
      query: 'coffee shops',
      results: [],
      totalCount: 0,
      message: 'No results found'
    }
  }
);

function DevEntry() {
  return (
    <ThemeProvider>
      <DevContainer
        widgets={[
          { id: 'carousel', name: 'Restaurant Carousel', component: CarouselWidget },
          { id: 'map', name: 'Location Map', component: MapWidget },
          { id: 'search', name: 'Search Results', component: SearchWidget }
        ]}
        loadingDelay={2000}
        theme="light"
        autoLoad={true}
        toolbarPosition="top"
        dataLoaders={{
          restaurants: () => restaurantData.full,
          locations: () => locationData,
          search: () => searchData.full
        }}
        emptyDataLoaders={{
          restaurants: () => restaurantData.empty,
          search: () => searchData.empty
        }}
        defaultDataLoader="restaurants"
        defaultWidget="carousel"
      />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <DevEntry />
  </React.StrictMode>
);