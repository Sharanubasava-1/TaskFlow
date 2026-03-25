import { createNodeComponent } from './nodeFactory';

export const MergeNode = createNodeComponent({
    title: 'Merge',
    badge: 'Utility',
    description: 'Combines two or more streams into one unified payload.',
    size: { width: 300, minHeight: 180 },
    handles: [
        { id: 'a', type: 'target', side: 'left', top: '30%' },
        { id: 'b', type: 'target', side: 'left', top: '70%' },
        { id: 'merged', type: 'source', side: 'right', top: '50%' },
    ],
    fields: [
        {
            key: 'strategy',
            label: 'Strategy',
            type: 'select',
            defaultValue: 'Append',
            options: [
                { label: 'Append', value: 'Append' },
                { label: 'Overwrite', value: 'Overwrite' },
                { label: 'Deep Merge', value: 'Deep Merge' },
            ],
        },
    ],
});
