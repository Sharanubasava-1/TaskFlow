// inputNode.js

import { createNodeComponent } from './nodeFactory';

export const InputNode = createNodeComponent({
  title: 'Input',
  badge: 'Source',
  description: 'Introduces external data into the graph.',
  size: { width: 280, minHeight: 170 },
  handles: [
    { id: 'in', type: 'target', side: 'left', top: '50%' },
    { id: 'value', type: 'source', side: 'right', top: '50%' },
  ],
  fields: [
    {
      key: 'inputName',
      label: 'Name',
      type: 'text',
      defaultValue: ({ id }) => id.replace('customInput-', 'input_'),
      placeholder: 'input_data',
    },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'Text',
      options: [
        { label: 'Text', value: 'Text' },
        { label: 'File', value: 'File' },
      ],
    },
  ],
});
