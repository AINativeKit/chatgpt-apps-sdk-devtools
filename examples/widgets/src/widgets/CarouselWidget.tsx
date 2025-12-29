import { useOpenAiGlobal, Carousel, SummaryCard, Alert } from '@ainativekit/ui';

interface Restaurant {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  badge: string;
  features: string[];
}

interface CarouselData {
  type: string;
  restaurants?: Restaurant[];
  totalResults?: number;
  location?: string;
  message?: string;
  error?: string;
}

function CarouselWidget() {
  const toolOutput = useOpenAiGlobal('toolOutput') as CarouselData | null;

  // Loading state - use Carousel's built-in loading
  if (!toolOutput) {
    return (
      <div className="py-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
          Pizza Restaurants
        </h2>
        <Carousel loading loadingSlides={4} />
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

  // Empty state - message only
  if (toolOutput.message && !toolOutput.restaurants?.length) {
    return (
      <div className="py-5">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
          Pizza Restaurants
        </h2>
        <Carousel
          emptyTitle="No Restaurants"
          emptyMessage={toolOutput.message}
        />
      </div>
    );
  }

  const { restaurants, totalResults, location } = toolOutput;

  return (
    <div className="py-5">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 px-5">
        Pizza Restaurants
      </h2>

      <Carousel
        align="start"
        showNavigation
        gap="16px"
        flushStart
        startInset="20px"
      >
        {restaurants?.map((restaurant) => (
          <SummaryCard
            key={restaurant.id}
            style={{ width: '220px', flexShrink: 0 }}
            images={restaurant.image}
            title={restaurant.title}
            subtitle={restaurant.subtitle}
            badge={restaurant.badge}
            size="compact"
            imageAspectRatio="4/3"
            metadata={restaurant.features.map((f) => ({ label: f, separator: '•' }))}
            description={restaurant.description}
            buttonText="Order now"
            onButtonClick={() => alert(`Order from ${restaurant.title}`)}
          />
        ))}
      </Carousel>

      {restaurants && restaurants.length > 0 && (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)] px-5">
          {totalResults || restaurants.length} pizza places{location ? ` in ${location}` : ''}
        </p>
      )}
    </div>
  );
}

export default CarouselWidget;
