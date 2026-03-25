// outputNode.js

import { createNodeComponent } from './nodeFactory';

export const OutputNode = createNodeComponent({
  title: 'Output',
  badge: 'Sink',
  description: 'Collects and exports the pipeline result.',
  size: { width: 280, minHeight: 170 },
  handles: [
    { id: 'value', type: 'target', side: 'left', top: '50%' },
    { id: 'next', type: 'source', side: 'right', top: '50%' },
  ],
  fields: [
    {
      key: 'outputName',
      label: 'Name',
      type: 'text',
      defaultValue: ({ id }) => id.replace('customOutput-', 'output_'),
      placeholder: 'final_answer',
    },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'Text',
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'Image', value: 'Image' },
      ],
    },
  ],
});
