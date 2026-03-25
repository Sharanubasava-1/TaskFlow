const API_BASE_URL = 'http://127.0.0.1:8000';

const stableStringify = (value) => {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }

    const keys = Object.keys(value).sort();
    const keyValuePairs = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${keyValuePairs.join(',')}}`;
};

export const getPipelineCacheKey = (payload) => {
    return ['pipeline-analysis', stableStringify(payload)];
};

export const parsePipeline = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
    }

    return response.json();
};
