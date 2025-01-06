import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Canvas from './components/WorkflowBuilder/Canvas';
import AnalyticsPanel from './components/AnalyticsPanel/AnalyticsPanel';
import useWorkflowStore from './store/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const hasWorkflowSaved = useWorkflowStore((state) => state.hasWorkflowSaved);

  const handleAnalyticsNavigation = () => {
    if (!hasWorkflowSaved) {
      toast.error("Please save workflow before moving to analytics panel");
    }
  };

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: 'space-around',
          padding: "7px",
          backgroundColor: "#007bff",
          color: "#fff",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Workflow Builder
        </Link>
        {hasWorkflowSaved ? (
          <Link to="/analytics" style={{ color: "white", textDecoration: "none" }}>
            Analytics
          </Link>
        ) : (
          <span
            style={{ color: "white", cursor: "pointer" }}
            onClick={handleAnalyticsNavigation}
          >
            Analytics
          </span>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/analytics" element={<AnalyticsPanel />} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
