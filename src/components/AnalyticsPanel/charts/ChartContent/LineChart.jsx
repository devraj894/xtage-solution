import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import useWorkflowStore from "../../../../store/store";
import "../chartStyles/chartStyles.css"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (nodes && nodes.length > 0 && edges && edges.length > 0) {
      const data = {
        labels: nodes.map((node) => node.data.label),
        datasets: [
          {
            label: "Cumulative Execution Time",
            data: nodes.map((node) => {
              return edges.reduce((total, edge) => {
                if (edge.source === node.id || edge.target === node.id) {
                  const connectedNode = nodes.find(
                    (n) => n.id === (edge.source === node.id ? edge.target : edge.source)
                  );
                  if (connectedNode) {
                    total += connectedNode.data.executionTime || 0;
                  }
                }
                return total;
              }, node.data.executionTime || 0);
            }),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4, 
          },
        ],
      };
      setChartData(data);
    }
  }, [nodes, edges]);

  if (!chartData.labels || !chartData.labels.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Cumulative Execution Time</h3>
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
