import { BaseNode } from './baseNode';

export const createNodeComponent = (config) => {
    const NodeComponent = ({ id, data }) => {
        const inputs =
            typeof config.inputs === 'function' ? config.inputs({ id, data }) : config.inputs || [];
        const outputs =
            typeof config.outputs === 'function' ? config.outputs({ id, data }) : config.outputs || [];
        const handles =
            typeof config.handles === 'function' ? config.handles({ id, data }) : config.handles || [];
        const fields =
            typeof config.fields === 'function' ? config.fields({ id, data }) : config.fields || [];

        return (
            <BaseNode
                id={id}
                data={data}
                title={config.title}
                badge={config.badge}
                description={config.description}
                inputs={inputs}
                outputs={outputs}
                handles={handles}
                fields={fields}
                size={config.size}
                className={config.className}
            >
                {typeof config.renderContent === 'function' ? config.renderContent({ id, data }) : null}
            </BaseNode>
        );
    };

    NodeComponent.displayName = `${config.title.replace(/\s+/g, '')}Node`;
    return NodeComponent;
};
