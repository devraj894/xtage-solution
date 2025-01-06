import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import useWorkflowStore from "../../../../store/store";
import "../chartStyles/chartStyles.css"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  const nodes = useWorkflowStore((state) => state.nodes); 
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const data = {
        labels: nodes.map((node) => node.data.label),
        datasets: [
          {
            label: "Execution Time",
            data: nodes.map((node) => node.data.executionTime || 0),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
    }
  }, [nodes]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
            family: "'Arial', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        cornerRadius: 5,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Arial', sans-serif",
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
            family: "'Arial', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Execution Time Analytics</h3>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading...</p>}
    </div>
  );
};

export default BarChart;