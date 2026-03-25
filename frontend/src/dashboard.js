import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useStore } from './store';

const CHART_COLORS = ['#0f766e', '#f59e0b', '#1d4ed8', '#16a34a'];

const SkeletonCard = () => (
    <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
    </div>
);

const ProgressRing = ({ value, label }) => {
    const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;

    return (
        <div className="progress-ring">
            <div
                className="progress-ring__circle"
                style={{ '--ring-value': `${safeValue}%` }}
                role="img"
                aria-label={`${label} ${safeValue.toFixed(0)} percent`}
            >
                <span>{safeValue.toFixed(0)}%</span>
            </div>
            <p>{label}</p>
        </div>
    );
};

export const PipelineDashboard = ({ analysis, isLoading, submitError }) => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const chartData = useMemo(() => {
        const nodeCount = analysis?.num_nodes ?? nodes.length;
        const edgeCount = analysis?.num_edges ?? edges.length;
        const maxPossible = Math.max(nodeCount * (nodeCount - 1), 1);
        const density = (edgeCount / maxPossible) * 100;
        const connectivity = nodeCount > 0 ? (edgeCount / nodeCount) * 100 : 0;
        const dagConfidence = analysis?.is_dag ? 100 : nodeCount > 0 ? 45 : 0;

        return {
            statBars: [
                { name: 'Nodes', value: nodeCount },
                { name: 'Edges', value: edgeCount },
            ],
            composition: [
                { name: 'Connected', value: Math.min(edgeCount, nodeCount) },
                { name: 'Unlinked', value: Math.max(nodeCount - edgeCount, 0) },
            ],
            density,
            connectivity,
            dagConfidence,
        };
    }, [analysis, edges.length, nodes.length]);

    return (
        <motion.section
            className="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        >
            <div className="dashboard__head">
                <h2>Pipeline Health Dashboard</h2>
                <p>Visualize structure quality before deployment.</p>
            </div>

            {submitError && <p className="dashboard__error">{submitError}</p>}

            {isLoading ? (
                <div className="dashboard__skeleton-grid">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : (
                <div className="dashboard__grid">
                    <article className="dashboard-card">
                        <h3>Graph Snapshot</h3>
                        <div className="dashboard-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.statBars}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0f766e" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </article>

                    <article className="dashboard-card">
                        <h3>Node Composition</h3>
                        <div className="dashboard-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.composition}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={46}
                                        outerRadius={78}
                                        dataKey="value"
                                    >
                                        {chartData.composition.map((entry, index) => (
                                            <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </article>

                    <article className="dashboard-card dashboard-card--progress">
                        <h3>Progress Indicators</h3>
                        <div className="dashboard-progress">
                            <ProgressRing value={chartData.density} label="Density" />
                            <ProgressRing value={chartData.connectivity} label="Connectivity" />
                            <ProgressRing value={chartData.dagConfidence} label="DAG Stability" />
                        </div>
                    </article>
                </div>
            )}
        </motion.section>
    );
};