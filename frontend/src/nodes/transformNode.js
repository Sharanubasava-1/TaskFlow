import { createNodeComponent } from './nodeFactory';

export const TransformNode = createNodeComponent({
    title: 'Transform',
    badge: 'Logic',
    description: 'Applies lightweight transformation rules to incoming data.',
    size: { width: 300, minHeight: 200 },
    handles: [
        { id: 'input', type: 'target', side: 'left', top: '50%' },
        { id: 'output', type: 'source', side: 'right', top: '50%' },
    ],
    fields: [
        {
            key: 'mode',
            label: 'Mode',
            type: 'select',
            defaultValue: 'Clean',
            options: [
                { label: 'Clean', value: 'Clean' },
                { label: 'Map', value: 'Map' },
                { label: 'Aggregate', value: 'Aggregate' },
            ],
        },
        {
            key: 'expression',
            label: 'Expression',
            type: 'text',
            defaultValue: 'value.trim()',
        },
    ],
});
