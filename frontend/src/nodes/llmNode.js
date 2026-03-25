// llmNode.js

import { createNodeComponent } from './nodeFactory';

export const LLMNode = createNodeComponent({
  title: 'LLM',
  badge: 'Model',
  description: 'Processes prompt + context and returns a response.',
  size: { width: 300, minHeight: 180 },
  handles: [
    { id: 'system', type: 'target', side: 'left', top: '34%' },
    { id: 'prompt', type: 'target', side: 'left', top: '66%' },
    { id: 'response', type: 'source', side: 'right', top: '50%' },
  ],
  fields: [
    {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      defaultValue: 'OpenAI',
      options: [
        { label: 'OpenAI', value: 'OpenAI' },
        { label: 'Anthropic', value: 'Anthropic' },
        { label: 'Gemini', value: 'Gemini' },
      ],
    },
    {
      key: 'temperature',
      label: 'Temperature',
      type: 'number',
      defaultValue: 0.2,
    },
  ],
});
