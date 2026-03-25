import { createNodeComponent } from './nodeFactory';

export const APINode = createNodeComponent({
    title: 'API Request',
    badge: 'Data',
    description: 'Calls an external endpoint and emits the response payload.',
    size: { width: 320, minHeight: 210 },
    handles: [
        { id: 'trigger', type: 'target', side: 'left', top: '30%' },
        { id: 'params', type: 'target', side: 'left', top: '70%' },
        { id: 'response', type: 'source', side: 'right', top: '50%' },
    ],
    fields: [
        {
            key: 'method',
            label: 'Method',
            type: 'select',
            defaultValue: 'GET',
            options: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
            ],
        },
        {
            key: 'url',
            label: 'URL',
            type: 'text',
            defaultValue: 'https://api.example.com/resource',
        },
    ],
});
