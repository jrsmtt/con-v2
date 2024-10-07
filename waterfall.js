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





import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WaterfallChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Example data for waterfall chart
    const data = {
      labels: [
        'Budget for Income',
        'F/X Loss',
        'Price Increase',
        'New Sales',
        'F/X Gain',
        'Loss of Customers',
        'New Customers',
        'Actual Income'
      ],
      datasets: [
        {
          label: 'Increase',
          data: [2000, 0, 600, 400, 100, 0, 450, 0], // Positive changes
          backgroundColor: '#4caf50', // Green for positive
          stack: 'waterfall',
        },
        {
          label: 'Decrease',
          data: [0, 300, 0, 0, 0, 1000, 0, 0], // Negative changes
          backgroundColor: '#f44336', // Red for negative
          stack: 'waterfall',
        },
        {
          label: 'Baseline',
          data: [2000, 1700, 2300, 2700, 2800, 1800, 2250, 2250], // Cumulative total baseline
          backgroundColor: '#ffffff00', // Transparent to form the baseline
          stack: 'waterfall',
        },
        {
          label: 'Total',
          data: [0, 0, 0, 0, 0, 0, 0, 2250], // Final total bar
          backgroundColor: '#8bc34a', // Different color for total
          stack: 'waterfall',
        }
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
          tooltip: {
            callbacks: {
              label: function(context) {
                let value = context.raw;
                if (context.dataset.label === 'Decrease') value = -value;
                return `${context.dataset.label}: ${value}`;
              }
            }
          }
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






import React from 'react';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { WaterfallController, BarElement } from 'chartjs-chart-waterfall';
import { Chart as ReactChart } from 'react-chartjs-2';

// Register the components needed for the Waterfall chart
Chart.register(CategoryScale, LinearScale, BarElement, WaterfallController, Title, Tooltip, Legend);

const WaterfallChart = () => {
  // Data for the Waterfall chart
  const data = {
    labels: [
      'Budget for Income',
      'F/X Loss',
      'Price Increase',
      'New Sales',
      'F/X Gain',
      'Loss of Customers',
      'New Customers',
      'Actual Income'
    ],
    datasets: [
      {
        label: 'Waterfall',
        data: [
          { y: 2000 }, // Starting point
          { y: -300 }, // F/X Loss
          { y: 600 },  // Price Increase
          { y: 400 },  // New Sales
          { y: 100 },  // F/X Gain
          { y: -1000 }, // Loss of Customers
          { y: 450 },  // New Customers
          { y: 2250, isSum: true }, // Final total (green bar)
        ],
        backgroundColor: (ctx) => {
          const value = ctx.raw.y;
          return value >= 0 ? '#4caf50' : '#f44336'; // Green for increase, red for decrease
        },
        borderColor: 'black',
        borderWidth: 1
      }
    ]
  };

  // Configuration options for the chart
  const options = {
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
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <ReactChart type="waterfall" data={data} options={options} />;
};

export default WaterfallChart;
