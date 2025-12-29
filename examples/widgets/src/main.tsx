import React from 'react';
import ReactDOM from 'react-dom/client';
import { DevContainer, createMockData } from '@ainativekit/devtools';
import { AppsSDKUIProvider } from '@ainativekit/ui';
import type { LocationData, AlbumType } from '@ainativekit/ui';

// Import styles - order matters!
import './index.css';
import '@openai/apps-sdk-ui/css';
import '@ainativekit/ui/styles';

// Import example widgets
import CarouselWidget from './widgets/CarouselWidget';
import MapWidget from './widgets/MapWidget';
import ListWidget from './widgets/ListWidget';
import AlbumWidget from './widgets/AlbumWidget';

// Pizza restaurant data for SummaryCard (compact) carousel
const pizzaRestaurants = [
  {
    id: 'little-nonas',
    title: "Little Nona's",
    subtitle: '1427 Via Campania',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
    description: 'Award-winning Neapolitan pies in North Beach.',
    badge: '4.8',
    features: ['$$$', 'Neapolitan', 'Wood-fired'],
  },
  {
    id: 'dough-re-mi',
    title: 'Dough-Re-Mi',
    subtitle: '512 Harmony Avenue',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
    description: 'Focaccia-style squares, late-night favorite.',
    badge: '4.6',
    features: ['$$', 'Focaccia', 'Late-night'],
  },
  {
    id: 'slice-society',
    title: 'Slice Society',
    subtitle: '839 Valencia Street',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
    description: 'Lively slice shop with a cult following.',
    badge: '4.9',
    features: ['$', 'Slices', 'Casual'],
  },
  {
    id: 'wood-fired-heaven',
    title: 'Wood Fired Heaven',
    subtitle: '234 Mission Street',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png',
    description: 'Traditional wood-fired with imported ingredients.',
    badge: '4.7',
    features: ['$$$', 'Wood-fired', 'Traditional'],
  },
  {
    id: 'margherita-express',
    title: 'Margherita Express',
    subtitle: '678 Columbus Avenue',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png',
    description: 'Fresh mozzarella and basil prepared daily with authentic Italian ingredients.',
    badge: '4.5',
    features: ['$$', 'Margherita', 'Fresh'],
  },
  {
    id: 'pesto-dreams',
    title: 'Pesto Dreams',
    subtitle: '456 Grant Avenue',
    image: 'https://persistent.oaistatic.com/pizzaz/pizzaz-5.png',
    description: 'Unique pesto-based variations and seasonal specials.',
    badge: '4.4',
    features: ['Pesto', 'Creative'],
  },
];

// Mock data for carousel (restaurants)
const carouselData = createMockData(
  {
    type: 'restaurant-carousel',
    restaurants: pizzaRestaurants,
    totalResults: pizzaRestaurants.length,
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

// Map locations - San Francisco pizza places with rich data
const mapLocations: LocationData[] = [
  {
    id: 'tonys-pizza',
    name: "Tony's Pizza Napoletana",
    subtitle: 'Neapolitan Pizzeria · North Beach',
    coords: [37.8001, -122.4098],
    description:
      'Award-winning Neapolitan pies in North Beach. A San Francisco institution serving authentic Italian pizza with locally-sourced ingredients.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
    features: [{ icon: 'star', label: '4.8' }, { label: '$$$' }],
    actions: [
      { label: 'Add to favorites', variant: 'primary' },
      { label: 'Contact', variant: 'secondary' },
    ],
    lists: [
      {
        title: 'Reviews',
        items: [
          {
            id: 'review-1',
            title: 'Sarah M.',
            metadata: '2 weeks ago',
            description:
              'Great location! The service was excellent and the atmosphere was perfect.',
          },
          {
            id: 'review-2',
            title: 'John D.',
            metadata: '1 month ago',
            description: 'Highly recommend! Will definitely come back with friends.',
          },
        ],
      },
    ],
  },
  {
    id: 'golden-boy',
    name: 'Golden Boy Pizza',
    subtitle: 'Focaccia Pizza · North Beach',
    coords: [37.799, -122.4093],
    description:
      'Focaccia-style squares, late-night favorite. Classic North Beach spot known for thick, fluffy focaccia pizza by the slice.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-2.png',
    features: [{ icon: 'star', label: '4.6' }, { label: '$' }],
    actions: [
      { label: 'Add to favorites', variant: 'primary' },
      { label: 'Call', variant: 'secondary' },
    ],
    lists: [
      {
        title: 'Reviews',
        items: [
          {
            id: 'review-1',
            title: 'Maria L.',
            metadata: '3 weeks ago',
            description: 'Late-night gem! Best focaccia pizza in the city.',
          },
        ],
      },
    ],
  },
  {
    id: 'delfina',
    name: 'Pizzeria Delfina',
    subtitle: 'Thin-Crust Pizza · Mission District',
    coords: [37.7613, -122.4255],
    description:
      'Thin-crust classics on 18th Street. Celebrated for perfectly charred, thin-crust pizzas made in a wood-burning oven.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-3.png',
    features: [{ icon: 'star', label: '4.5' }, { label: '$$' }],
    actions: [
      { label: 'Add to favorites', variant: 'primary' },
      { label: 'Reservations', variant: 'secondary' },
    ],
  },
  {
    id: 'flour-water',
    name: 'Flour + Water Pizzeria',
    subtitle: 'Artisan Pizza · Mission District',
    coords: [37.7775, -122.4388],
    description:
      'Deep-dish and cornmeal crust favorites. Innovative pizzeria from the Flour + Water team with seasonal rotating menu.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-6.png',
    features: [{ icon: 'star', label: '4.5' }, { label: '$$' }],
  },
  {
    id: 'beretta',
    name: 'Beretta',
    subtitle: 'Wood-Fired Pizzeria · North Beach',
    coords: [37.799, -122.4077],
    description:
      'Wood-fired pies and burrata in North Beach. Stylish spot combining pizza excellence with a full cocktail program.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-4.png',
    features: [{ icon: 'star', label: '4.6' }, { label: '$$' }],
  },
  {
    id: 'slice-house',
    name: 'Slice House',
    subtitle: 'Neighborhood Pizza · Valencia Street',
    coords: [37.7722, -122.438],
    description:
      'Neighborhood spot with seasonal toppings. Local favorite featuring creative combinations and locally-sourced ingredients.',
    thumbnail: 'https://persistent.oaistatic.com/pizzaz/pizzaz-1.png',
    features: [{ icon: 'star', label: '4.4' }, { label: '$$' }],
  },
];

// Mock data for map
const mapData = {
  type: 'map-locations',
  locations: mapLocations,
  center: { lat: 37.7749, lng: -122.4194 },
  zoom: 12
};

// Pizza places for ranked list
const pizzaPlaces = [
  {
    id: '1',
    name: "Tony's Pizza Napoletana",
    city: 'North Beach',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Golden Boy Pizza',
    city: 'North Beach',
    rating: 4.6,
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Pizzeria Delfina (Mission)',
    city: 'Mission',
    rating: 4.5,
    thumbnail: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Little Star Pizza',
    city: 'Alamo Square',
    rating: 4.5,
    thumbnail: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Il Casaro Pizzeria',
    city: 'North Beach',
    rating: 4.6,
    thumbnail: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: "Capo's",
    city: 'North Beach',
    rating: 4.4,
    thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
  },
  {
    id: '7',
    name: 'Ragazza',
    city: 'Lower Haight',
    rating: 4.4,
    thumbnail: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=200&h=200&fit=crop',
  },
];

// Mock data for list
const listData = createMockData(
  {
    type: 'pizza-list',
    title: 'National Best Pizza List',
    subtitle: 'A ranking of the best pizzerias in the world',
    headerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    places: pizzaPlaces,
    totalCount: pizzaPlaces.length
  },
  {
    emptyData: {
      type: 'pizza-list',
      title: 'National Best Pizza List',
      subtitle: 'A ranking of the best pizzerias in the world',
      headerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
      places: [],
      totalCount: 0,
      message: 'No pizza places found'
    }
  }
);

// Photo albums data
const photoAlbums: AlbumType[] = [
  {
    id: 'responsive-showcase',
    title: 'Responsive Design Showcase',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    photos: [
      {
        id: 'landscape',
        title: 'Mountain Majesty (16:9)',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop',
        alt: 'Majestic mountain landscape in full resolution',
      },
      {
        id: 'portrait',
        title: 'Winter Portrait (2:3)',
        url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=1200&fit=crop',
        alt: 'Winter portrait in full resolution',
      },
      {
        id: 'square',
        title: 'Coffee Culture (1:1)',
        url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1000&fit=crop',
        alt: 'Coffee cup on wooden table in full resolution',
      },
      {
        id: 'wide',
        title: 'Ocean Horizon (21:9)',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2100&h=900&fit=crop',
        alt: 'Wide ocean horizon photo in full resolution',
      },
      {
        id: 'standard',
        title: 'Golden Sunset (4:3)',
        url: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=900&fit=crop',
        alt: 'Golden sunset over landscape in full resolution',
      },
    ],
  },
  {
    id: 'nature-wonders',
    title: 'Nature Wonders',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    photos: [
      {
        id: 'n1',
        title: 'Forest Serenity',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        alt: 'Peaceful forest with natural light filtering through trees',
      },
      {
        id: 'n2',
        title: 'Alpine Peaks',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        alt: 'Snow-covered mountain peaks reaching towards the sky',
      },
      {
        id: 'n3',
        title: 'Waterfall Magic',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop',
        alt: 'Cascading waterfall surrounded by lush forest',
      },
      {
        id: 'n4',
        title: 'Northern Lights',
        url: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1200&h=800&fit=crop',
        alt: 'Aurora borealis dancing across the night sky',
      },
    ],
  },
  {
    id: 'urban-exploration',
    title: 'Urban Exploration',
    cover: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    photos: [
      {
        id: 'u1',
        title: 'City Skyline',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
        alt: 'Modern city skyline illuminated at dusk',
      },
      {
        id: 'u2',
        title: 'Street Art',
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=800&fit=crop',
        alt: 'Vibrant street art and colorful murals on city walls',
      },
      {
        id: 'u3',
        title: 'Neon Nights',
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop',
        alt: 'Neon lights illuminating urban night streets',
      },
      {
        id: 'u4',
        title: 'Urban Architecture',
        url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop',
        alt: 'Modern building architecture with geometric patterns',
      },
      {
        id: 'u5',
        title: 'Downtown Vibes',
        url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop',
        alt: 'Busy downtown street scene with urban energy',
      },
    ],
  },
  {
    id: 'travel-adventures',
    title: 'Travel Adventures',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    photos: [
      {
        id: 't1',
        title: 'Tropical Paradise',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop',
        alt: 'Tropical beach with swaying palm trees and turquoise water',
      },
      {
        id: 't2',
        title: 'Desert Dunes',
        url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=800&fit=crop',
        alt: 'Golden sand dunes glowing at sunset',
      },
      {
        id: 't3',
        title: 'Ancient Temple',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        alt: 'Historic temple architecture with intricate details',
      },
      {
        id: 't4',
        title: 'Island Escape',
        url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=800&fit=crop',
        alt: 'Serene island with crystal clear turquoise waters',
      },
    ],
  },
  {
    id: 'lifestyle-moments',
    title: 'Lifestyle Moments',
    cover: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
    photos: [
      {
        id: 'l1',
        title: 'Morning Coffee',
        url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&h=800&fit=crop',
        alt: 'Cozy morning coffee scene with natural window light',
      },
      {
        id: 'l2',
        title: 'Creative Workspace',
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
        alt: 'Modern creative workspace with plants and inspiration',
      },
      {
        id: 'l3',
        title: 'Fitness Journey',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
        alt: 'Active lifestyle and outdoor fitness activities',
      },
      {
        id: 'l4',
        title: 'Cherished Moments',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
        alt: 'Happy moments shared with loved ones',
      },
    ],
  },
];

// Mock data for albums
const albumData = {
  type: 'photo-albums',
  albums: photoAlbums,
  totalCount: photoAlbums.length
};

function DevEntry() {
  return (
    <AppsSDKUIProvider linkComponent="a">
      <DevContainer
        widgets={[
          { id: 'carousel', name: 'Pizza Carousel', component: CarouselWidget, dataLoader: () => carouselData.full, emptyDataLoader: () => carouselData.empty },
          { id: 'map', name: 'Pizza Map', component: MapWidget, dataLoader: () => mapData },
          { id: 'list', name: 'Pizza List', component: ListWidget, dataLoader: () => listData.full, emptyDataLoader: () => listData.empty },
          { id: 'album', name: 'Photo Albums', component: AlbumWidget, dataLoader: () => albumData }
        ]}
        loadingDelay={1500}
        theme="light"
        autoLoad={true}
        defaultWidget="carousel"
      />
    </AppsSDKUIProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <DevEntry />
  </React.StrictMode>
);
