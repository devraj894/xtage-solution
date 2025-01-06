import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useWorkflowStore from "../../../../store/store";
import "../chartStyles/chartStyles.css"

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  console.log("Node", nodes);
  const [chartData, setChartData] = useState(null);

  const generateColors = (count) => {
    return Array.from({ length: count }, () =>
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
  };

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const typeDistribution = nodes.reduce((acc, node) => {
        const type = node?.type || "unknown"; 
        const time = node.data?.executionTime || 0;
        acc[type] = (acc[type] || 0) + time;
        return acc;
      }, {});

      const total = Object.values(typeDistribution).reduce((a, b) => a + b, 0);
      const labels = Object.keys(typeDistribution).map(
        (key) => `${key} (${((typeDistribution[key] / total) * 100).toFixed(1)}%)`
      );

      const data = {
        labels,
        datasets: [
          {
            label: "Execution Time by Node Type", 
            data: Object.values(typeDistribution),
            backgroundColor: generateColors(Object.keys(typeDistribution).length),
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(data);
    } else {
      setChartData(null); 
    }
  }, [nodes]);

  if (!chartData) {
    return <div>No data available</div>;
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Execution Time Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
