/**
 * ScenarioPicker - UI component for selecting mock data scenarios
 */

import { Chip } from '@ainativekit/ui';
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
          <Chip
            key={`${scenario.name}-${index}`}
            selected={isSelected}
            onClick={() => onSelectScenario(scenario)}
            disabled={isLoading}
            title={scenario.description || scenario.name}
          >
            {isLoading && isSelected && hasDelay ? '⏳ ' : ''}
            {scenario.name}
          </Chip>
        );
      })}
    </div>
  );
}
