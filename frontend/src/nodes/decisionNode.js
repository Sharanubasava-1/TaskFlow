import { createNodeComponent } from './nodeFactory';

export const DecisionNode = createNodeComponent({
    title: 'Decision',
    badge: 'Control',
    description: 'Branches execution based on a boolean condition.',
    size: { width: 310, minHeight: 190 },
    handles: [
        { id: 'input', type: 'target', side: 'left', top: '50%' },
        { id: 'true', type: 'source', side: 'right', top: '36%', color: '#16a34a' },
        { id: 'false', type: 'source', side: 'right', top: '64%', color: '#dc2626' },
    ],
    fields: [
        {
            key: 'condition',
            label: 'Condition',
            type: 'text',
            defaultValue: 'score > 0.7',
        },
    ],
});
