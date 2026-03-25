// toolbar.js

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DraggableNode } from './draggableNode';
import { useDebouncedValue } from './hooks/useDebouncedValue';

const NODE_LIBRARY = [
    { type: 'customInput', label: 'Input' },
    { type: 'llm', label: 'LLM' },
    { type: 'customOutput', label: 'Output' },
    { type: 'text', label: 'Text' },
    { type: 'apiRequest', label: 'API Request' },
    { type: 'transform', label: 'Transform' },
    { type: 'decision', label: 'Decision' },
    { type: 'merge', label: 'Merge' },
    { type: 'delay', label: 'Delay' },
];

export const PipelineToolbar = () => {
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebouncedValue(searchInput, 220).trim().toLowerCase();

    const visibleNodes = useMemo(() => {
        if (!debouncedSearch) {
            return NODE_LIBRARY;
        }

        return NODE_LIBRARY.filter((node) => node.label.toLowerCase().includes(debouncedSearch));
    }, [debouncedSearch]);

    return (
        <motion.div
            className="pipeline-toolbar"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <label className="toolbar-search">
                <span>Find Node</span>
                <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search node types"
                />
            </label>
            <div className="pipeline-toolbar__grid">
                {visibleNodes.map((node) => (
                    <DraggableNode key={node.type} type={node.type} label={node.label} />
                ))}
            </div>
            {visibleNodes.length === 0 && <p className="toolbar-empty">No nodes match your search.</p>}
        </motion.div>
    );
};
