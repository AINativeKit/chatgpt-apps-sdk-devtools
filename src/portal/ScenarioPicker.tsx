/**
 * ScenarioPicker - UI component for selecting mock data scenarios
 */

import { Badge } from '@ainativekit/ui';
import type { Scenario } from '../mock';

export interface ScenarioPickerProps {
  /** Available scenarios to pick from */
  scenarios: Scenario[];

  /** Currently selected scenario name */
  selectedScenario: string | null;

  /** Callback when scenario is selected */
  onSelectScenario: (scenario: Scenario) => void;

  /** Whether a scenario is currently loading */
  isLoading?: boolean;
}

export function ScenarioPicker({
  scenarios,
  selectedScenario,
  onSelectScenario,
  isLoading = false,
}: ScenarioPickerProps) {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--ai-color-text-tertiary)',
          fontWeight: '500',
          marginRight: '4px',
        }}
      >
        Scenario:
      </span>
      {scenarios.map((scenario, index) => {
        const isSelected = selectedScenario === scenario.name;
        const hasDelay = (scenario.delay ?? 0) > 0;

        return (
          <button
            key={`${scenario.name}-${index}`}
            onClick={() => onSelectScenario(scenario)}
            disabled={isLoading}
            title={scenario.description || scenario.name}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Badge
              color={isSelected ? 'primary' : 'secondary'}
              variant={isSelected ? 'solid' : 'outline'}
            >
              {isLoading && isSelected && hasDelay ? '⏳ ' : ''}
              {scenario.name}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
