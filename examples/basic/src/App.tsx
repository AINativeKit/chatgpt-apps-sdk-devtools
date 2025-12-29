import React from 'react';
import { useOpenAiGlobal, Skeleton, Alert, Button, Card } from '@ainativekit/ui';

/**
 * Example ChatGPT Widget
 * This demonstrates how to build a widget that works with @ainativekit/devtools
 * using the new OpenAI Apps SDK UI components and design tokens.
 */
function App() {
  const toolOutput = useOpenAiGlobal('toolOutput');
  const theme = useOpenAiGlobal('theme');

  // Show loading state using Skeleton
  if (!toolOutput) {
    return (
      <div className="p-5 flex flex-col gap-4">
        <Skeleton width="60%" height={32} />
        <Skeleton width="100%" height={20} />
        <Skeleton width="80%" height={20} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
      </div>
    );
  }

  // Show error state using Alert
  if (toolOutput.error) {
    return (
      <div className="p-5">
        <Alert color="danger" variant="soft" title="Error" description={toolOutput.error} />
      </div>
    );
  }

  // Show data using Card and Button with design tokens
  return (
    <Card className="m-5">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        Example ChatGPT Widget
      </h1>
      <p className="text-[var(--color-text-secondary)] mt-2">
        This widget is wrapped with @ainativekit/devtools for development.
      </p>

      <Card elevation={1} className="mt-5">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
          Current State:
        </h3>
        <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
          <li>Theme: <strong className="text-[var(--color-text-primary)]">{theme}</strong></li>
          <li>Data Type: <strong className="text-[var(--color-text-primary)]">{toolOutput.type || 'default'}</strong></li>
          <li>Timestamp: <strong className="text-[var(--color-text-primary)]">{toolOutput.timestamp || 'N/A'}</strong></li>
        </ul>
      </Card>

      <Card elevation={1} className="mt-5">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
          Tool Output:
        </h3>
        <pre className="text-xs overflow-auto max-h-[200px] p-3 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
          {JSON.stringify(toolOutput, null, 2)}
        </pre>
      </Card>

      <div className="mt-5">
        <Button
          onClick={() => {
            if (window.openai?.sendFollowUpMessage) {
              window.openai.sendFollowUpMessage({
                prompt: 'User clicked the button!'
              });
            }
          }}
        >
          Test OpenAI API
        </Button>
      </div>
    </Card>
  );
}

export default App;
