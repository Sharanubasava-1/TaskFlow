import { createNodeComponent } from './nodeFactory';

export const DelayNode = createNodeComponent({
    title: 'Delay',
    badge: 'Flow',
    description: 'Waits for a specified number of milliseconds before forwarding.',
    size: { width: 295, minHeight: 180 },
    handles: [
        { id: 'input', type: 'target', side: 'left', top: '50%' },
        { id: 'output', type: 'source', side: 'right', top: '50%' },
    ],
    fields: [
        {
            key: 'durationMs',
            label: 'Duration (ms)',
            type: 'number',
            defaultValue: 300,
        },
    ],
});
