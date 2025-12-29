import { useState } from 'react';
import { useOpenAiGlobal, List, ListItem, Skeleton, Alert, Button } from '@ainativekit/ui';
import { PlusCircleAdd, CheckCircleFilled } from '@openai/apps-sdk-ui/components/Icon';

interface PizzaPlace {
  id: string;
  name: string;
  city: string;
  rating: number;
  thumbnail: string;
}

interface ListData {
  type: string;
  title?: string;
  subtitle?: string;
  headerImage?: string;
  places?: PizzaPlace[];
  totalCount?: number;
  message?: string;
  error?: string;
}

function ListWidget() {
  const toolOutput = useOpenAiGlobal('toolOutput') as ListData | null;
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  const handleTogglePlace = (id: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Loading state
  if (!toolOutput) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <Skeleton width="60%" height={28} />
        <Skeleton width="40%" height={20} />
        <div className="flex flex-col gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width="100%" height={72} />
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

  const { title, subtitle, headerImage, places, message } = toolOutput;

  // Empty state
  if (!places?.length) {
    return (
      <div className="p-5">
        <List
          header={{
            title: title || 'Pizza List',
            subtitle: subtitle,
            thumbnail: headerImage,
          }}
          items={[]}
          renderItem={() => null}
          emptyTitle="No Results"
          emptyMessage={message || 'No pizza places found'}
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <List
        header={{
          title: title || 'National Best Pizza List',
          subtitle: subtitle || 'A ranking of the best pizzerias in the world',
          thumbnail: headerImage,
          action: (
            <Button color="primary" variant="solid">
              Save List
            </Button>
          ),
        }}
        items={places}
        renderItem={(place, index) => (
          <ListItem
            key={place.id}
            rank={index + 1}
            title={place.name}
            features={[{ icon: 'star', label: `${place.rating}` }]}
            media={place.thumbnail}
            mediaAlt={place.name}
            metadata={place.city}
            onClick={() => handleTogglePlace(place.id)}
            interactive
            action={
              <Button
                uniform
                color="secondary"
                aria-label={`${selectedPlaces.includes(place.id) ? 'Remove from' : 'Add to'} favorites`}
                variant="ghost"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleTogglePlace(place.id);
                }}
              >
                {selectedPlaces.includes(place.id) ? (
                  <CheckCircleFilled />
                ) : (
                  <PlusCircleAdd />
                )}
              </Button>
            }
          />
        )}
      />

      {selectedPlaces.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            Your Favorites ({selectedPlaces.length})
          </p>
          <ul className="mt-2 ml-5 list-disc text-sm text-[var(--color-text-secondary)]">
            {selectedPlaces.map((id) => {
              const place = places.find((p) => p.id === id);
              return <li key={id}>{place?.name}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ListWidget;
