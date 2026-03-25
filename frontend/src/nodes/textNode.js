// textNode.js

import { useEffect, useMemo, useState } from 'react';
import { BaseNode } from './baseNode';
import { useStore } from '../store';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const VARIABLE_REGEX = /{{\s*([A-Za-z_$][\w$]*)\s*}}/g;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const extractVariables = (text) => {
  const matches = [...text.matchAll(VARIABLE_REGEX)].map((match) => match[1]);
  return [...new Set(matches)];
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const debouncedText = useDebouncedValue(currText, 240);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  useEffect(() => {
    updateNodeField(id, 'text', debouncedText);
    updateNodeField(id, 'variables', extractVariables(debouncedText));
  }, [debouncedText, id, updateNodeField]);

  const lineCount = useMemo(() => currText.split('\n').length, [currText]);
  const longestLineLength = useMemo(
    () => currText.split('\n').reduce((max, line) => Math.max(max, line.length), 0),
    [currText]
  );

  const dynamicSize = useMemo(
    () => ({
      width: clamp(260 + longestLineLength * 6, 260, 520),
      minHeight: clamp(170 + lineCount * 18 + variables.length * 14, 170, 460),
    }),
    [lineCount, longestLineLength, variables.length]
  );

  const dynamicInputs = useMemo(() => {
    return variables.map((variable, index) => ({
      id: `var-${variable}`,
      side: 'left',
      top: `${((index + 1) * 100) / (variables.length + 1)}%`,
      color: '#16a34a',
    }));
  }, [variables]);

  const handleTextChange = (event) => {
    const nextText = event.target.value;
    setCurrText(nextText);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      badge="Template"
      description="Write text with {{variables}} to generate dynamic input handles."
      inputs={dynamicInputs}
      outputs={[{ id: 'output', side: 'right', top: '50%' }]}
      size={dynamicSize}
      className="pipeline-node--text"
    >
      <label className="pipeline-node__field">
        <span>Text</span>
        <textarea
          value={currText}
          rows={Math.max(3, Math.min(14, lineCount + 1))}
          onChange={handleTextChange}
          placeholder="Example: Summarize {{article}} in tone {{style}}"
        />
      </label>
      {variables.length > 0 && (
        <div className="pipeline-node__tags">
          {variables.map((variable) => (
            <span key={`${id}-${variable}`} className="pipeline-node__tag">
              {variable}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};
