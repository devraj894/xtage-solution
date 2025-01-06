import React from "react";
import BarChart from "./charts/ChartContent/BarChart";
import PieChart from "./charts/ChartContent/PieChart";
import LineChart from "./charts/ChartContent/LineChart"; 
import "./styles/AnalyticsPanel.css"; 

const AnalyticsPanel = ({ nodes }) => {
  return (
    <div className="analytics-panel">
      <h2 className="panel-title">Analytics Panel</h2>
      <div className="chart-container">
        <div className="chart-item">
          <BarChart />
        </div>
        <div className="chart-item">
          <PieChart />
        </div>
      </div>
      <div className="line-chart-container">
        <LineChart />
      </div>
    </div>
  );
};

export default AnalyticsPanel;
