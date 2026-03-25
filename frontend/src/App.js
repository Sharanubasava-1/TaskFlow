import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PipelineToolbar = lazy(() =>
  import('./toolbar').then((module) => ({ default: module.PipelineToolbar }))
);
const PipelineUI = lazy(() =>
  import('./ui').then((module) => ({ default: module.PipelineUI }))
);
const PipelineDashboard = lazy(() =>
  import('./dashboard').then((module) => ({ default: module.PipelineDashboard }))
);
const SubmitButton = lazy(() =>
  import('./submit').then((module) => ({ default: module.SubmitButton }))
);

const getInitialTheme = () => {
  const savedTheme = window.localStorage.getItem('pipeline-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [analysis, setAnalysis] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisPopup, setAnalysisPopup] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('pipeline-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleResult = (result) => {
    setSubmitError('');
    setAnalysis(result);

    const formsDag = result?.is_dag ? 'Yes' : 'No';
    const nodeCount = Number.isFinite(result?.num_nodes) ? result.num_nodes : 0;
    const edgeCount = Number.isFinite(result?.num_edges) ? result.num_edges : 0;

    setAnalysisPopup({
      nodes: nodeCount,
      edges: edgeCount,
      formsDag,
    });
  };

  const handleError = (message) => {
    setSubmitError(message);
  };

  return (
    <div className="app-shell">
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="app-header__title-wrap">
          <p className="app-kicker">VectorShift Pipeline Studio</p>
          <h1>Design and Validate AI Workflows</h1>
        </div>
        <div className="app-header__actions">
          <p className="app-subtitle">
            Drag nodes from the library, connect them, and submit to inspect graph metrics.
          </p>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </motion.header>

      <motion.main
        className="app-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
      >
        <Suspense fallback={<div className="lazy-fallback">Loading editor modules...</div>}>
          <PipelineToolbar />
          <PipelineUI />
        </Suspense>
      </motion.main>

      <Suspense fallback={<div className="lazy-fallback">Loading analytics...</div>}>
        <PipelineDashboard
          analysis={analysis}
          isLoading={isSubmitting}
          submitError={submitError}
        />
      </Suspense>

      <Suspense fallback={<div className="lazy-fallback">Loading submit actions...</div>}>
        <SubmitButton
          onResult={handleResult}
          onError={handleError}
          onLoadingChange={setIsSubmitting}
        />
      </Suspense>

      {analysisPopup && (
        <div className="analysis-modal" role="dialog" aria-modal="true" aria-labelledby="analysis-modal-title">
          <div className="analysis-modal__card">
            <h3 id="analysis-modal-title">Pipeline Analysis</h3>
            <p>Nodes: {analysisPopup.nodes}</p>
            <p>Edges: {analysisPopup.edges}</p>
            <p>Forms DAG: {analysisPopup.formsDag}</p>
            <div className="analysis-modal__actions">
              <button
                type="button"
                className="analysis-modal__ok"
                onClick={() => setAnalysisPopup(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
