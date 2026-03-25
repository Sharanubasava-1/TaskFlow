import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const SIDE_TO_POSITION = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,
    bottom: Position.Bottom,
};

const buildInitialValues = (fields, id, data) => {
    return fields.reduce((acc, field) => {
        const resolvedDefault =
            typeof field.defaultValue === 'function'
                ? field.defaultValue({ id, data })
                : field.defaultValue;
        acc[field.key] = data?.[field.key] ?? resolvedDefault ?? '';
        return acc;
    }, {});
};

export const BaseNode = ({
    id,
    data = {},
    title,
    badge = 'Node',
    description,
    fields = [],
    inputs = [],
    outputs = [],
    handles = [],
    size = {},
    className = '',
    children,
    onFieldChange,
}) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const initialValues = useMemo(() => buildInitialValues(fields, id, data), [fields, id, data]);
    const [fieldValues, setFieldValues] = useState(initialValues);
    const [debouncedFields, setDebouncedFields] = useState({});

    useEffect(() => {
        setFieldValues(initialValues);
    }, [initialValues]);

    useEffect(() => {
        const keys = Object.keys(debouncedFields);

        if (keys.length === 0) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            keys.forEach((fieldKey) => {
                const nextValue = debouncedFields[fieldKey];
                updateNodeField(id, fieldKey, nextValue);
                onFieldChange?.(fieldKey, nextValue);
            });
            setDebouncedFields({});
        }, 220);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [debouncedFields, id, onFieldChange, updateNodeField]);

    const handleFieldValueChange = (fieldKey, rawValue, fieldType) => {
        const nextValue = fieldType === 'number' ? Number(rawValue) : rawValue;

        setFieldValues((prev) => ({
            ...prev,
            [fieldKey]: nextValue,
        }));

        const shouldDebounce = fieldType === 'text' || fieldType === 'textarea' || fieldType === undefined;

        if (shouldDebounce) {
            setDebouncedFields((prev) => ({
                ...prev,
                [fieldKey]: nextValue,
            }));
            return;
        }

        updateNodeField(id, fieldKey, nextValue);
        onFieldChange?.(fieldKey, nextValue);
    };

    const normalizedInputs = inputs.map((input, index) => {
        if (typeof input === 'string') {
            return {
                id: input,
                type: 'target',
                side: 'left',
                top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
            };
        }

        return {
            ...input,
            type: 'target',
            side: input.side || 'left',
        };
    });

    const normalizedOutputs = outputs.map((output, index) => {
        if (typeof output === 'string') {
            return {
                id: output,
                type: 'source',
                side: 'right',
                top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
            };
        }

        return {
            ...output,
            type: 'source',
            side: output.side || 'right',
        };
    });

    const allHandles = [...normalizedInputs, ...normalizedOutputs, ...handles];

    return (
        <div
            className={`pipeline-node ${className}`.trim()}
            style={{
                width: size.width,
                minHeight: size.minHeight,
            }}
        >
            {allHandles.map((handle) => (
                <Handle
                    key={`${id}-${handle.id}`}
                    type={handle.type}
                    position={SIDE_TO_POSITION[handle.side || 'left']}
                    id={`${id}-${handle.id}`}
                    className="pipeline-node__handle"
                    style={{
                        top: handle.top,
                        bottom: handle.bottom,
                        background: handle.color,
                    }}
                />
            ))}

            <div className="pipeline-node__header">
                <span className="pipeline-node__badge">{badge}</span>
                <h4 className="pipeline-node__title">{title}</h4>
                {description && <p className="pipeline-node__description">{description}</p>}
            </div>

            <div className="pipeline-node__body">
                {fields.map((field) => (
                    <label key={field.key} className="pipeline-node__field">
                        <span>{field.label}</span>
                        {field.type === 'select' ? (
                            <select
                                value={fieldValues[field.key]}
                                onChange={(event) =>
                                    handleFieldValueChange(field.key, event.target.value, field.type)
                                }
                            >
                                {(field.options || []).map((option) => (
                                    <option key={`${field.key}-${option.value}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                value={fieldValues[field.key]}
                                rows={field.rows || 3}
                                placeholder={field.placeholder}
                                onChange={(event) =>
                                    handleFieldValueChange(field.key, event.target.value, field.type)
                                }
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                value={fieldValues[field.key]}
                                placeholder={field.placeholder}
                                onChange={(event) =>
                                    handleFieldValueChange(field.key, event.target.value, field.type)
                                }
                            />
                        )}
                    </label>
                ))}
                {children}
            </div>
        </div>
    );
};
