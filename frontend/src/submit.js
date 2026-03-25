// submit.js

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from './store';
import { getPipelineCacheKey, parsePipeline } from './api/pipelineApi';

export const SubmitButton = ({ onResult, onError, onLoadingChange }) => {
    const queryClient = useQueryClient();
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const parseMutation = useMutation({
        mutationFn: async (payload) => {
            const cacheKey = getPipelineCacheKey(payload);
            const cachedResult = queryClient.getQueryData(cacheKey);

            if (cachedResult) {
                return cachedResult;
            }

            const result = await parsePipeline(payload);
            queryClient.setQueryData(cacheKey, result);
            return result;
        },
        onSuccess: (result) => {
            onError('');
            onResult(result);
        },
        onError: (error) => {
            onError(`Unable to parse pipeline. ${error.message}`);
        },
    });

    useEffect(() => {
        onLoadingChange(parseMutation.isPending);
    }, [onLoadingChange, parseMutation.isPending]);

    const handleSubmit = async () => {
        const payload = {
            nodes: nodes.map((node) => ({ id: node.id, type: node.type, data: node.data })),
            edges: edges.map((edge) => ({ source: edge.source, target: edge.target })),
        };

        parseMutation.mutate(payload);
    };

    return (
        <motion.div
            className="submit-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
            <button
                type="button"
                className="submit-button"
                onClick={handleSubmit}
                disabled={parseMutation.isPending}
            >
                {parseMutation.isPending ? 'Analyzing Pipeline...' : 'Submit Pipeline'}
            </button>
        </motion.div>
    );
}
