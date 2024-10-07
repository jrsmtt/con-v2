import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WaterfallChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Example data for waterfall chart
    const data = {
      labels: ['Start', 'Step 1', 'Step 2', 'Step 3', 'End'],
      datasets: [
        {
          label: 'Increase',
          data: [0, 30, 50, 70, 0], // Only positive increments here
          backgroundColor: '#4caf50', // Green for positive
          stack: 'waterfall',
        },
        {
          label: 'Decrease',
          data: [100, 0, 0, 0, 50], // Only negative increments here
          backgroundColor: '#f44336', // Red for negative
          stack: 'waterfall',
        },
        {
          label: 'Baseline',
          data: [100, 100, 130, 180, 180], // Cumulative baseline for the waterfall effect
          backgroundColor: '#ffffff00', // Transparent to form the baseline
          stack: 'waterfall',
        },
      ],
    };

    const config = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Waterfall Chart',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    };

    const waterfallChart = new Chart(ctx, config);

    // Cleanup on component unmount
    return () => {
      waterfallChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default WaterfallChart;
