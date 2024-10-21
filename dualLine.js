// src/DualAxisChart.js

import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DualAxisChart = () => {
  const chartRef = useRef(null); // Reference to the canvas element
  const chartInstance = useRef(null); // Reference to the Chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Define the chart data
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          type: 'bar',
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Profit Margin (%)',
          data: [20, 25, 30, 35, 40, 45],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          yAxisID: 'y1',
        },
      ],
    };

    // Define the chart options
    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sales and Profit Margin Over Months',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Sales',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          grid: {
            display: true,
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Profit Margin (%)',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          grid: {
            drawOnChartArea: false, // Prevents grid lines from overlapping
          },
          ticks: {
            beginAtZero: true,
            max: 50, // Adjust based on your data
          },
        },
      },
    };

    // Initialize the Chart instance
    chartInstance.current = new Chart(ctx, {
      data,
      options,
    });

    // Cleanup function to destroy the chart on component unmount
    return () => {
      chartInstance.current.destroy();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DualAxisChart;






import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DualAxisChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Create the chart
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            type: 'bar', // First dataset as a bar chart
            label: 'Applications',
            data: [50, 70, 90, 100],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            yAxisID: 'y', // Use the left y-axis
          },
          {
            type: 'line', // Second dataset as a line chart
            label: 'Approval Rate',
            data: [60, 80, 65, 95],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            yAxisID: 'y1', // Use the right y-axis
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Applications',
            },
            grid: {
              display: true,
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Approval Rate (%)',
            },
            grid: {
              drawOnChartArea: false, // Disable grid on right y-axis to avoid overlapping
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Applications and Approval Rate (Dual Axis Chart)',
          },
        },
      },
    });

    // Clean up the chart on component unmount
    return () => {
      myChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default DualAxisChart;




import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { DateTime } from 'luxon';  // Optionally used to handle different date formats

const DualAxisChart = ({ JsonData, approvedApplicationsKey, xaxisValueKey, dateFrequency }) => {
  const chartRef = useRef(null);

  // Helper function to handle date formatting based on frequency
  const formatDate = (date) => {
    switch (dateFrequency) {
      case 'daily':
        return DateTime.fromISO(date).toFormat('yyyy-LL-dd');
      case 'monthly':
        return DateTime.fromISO(date).toFormat('yyyy-LL');
      case 'yearly':
        return DateTime.fromISO(date).toFormat('yyyy');
      default:
        return date; // Default to the provided format
    }
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Extract the labels (x-axis values) and datasets (approved/declined applications)
    const labels = JsonData.map(item => formatDate(item[xaxisValueKey]));
    const approvedApplications = JsonData.map(item => item[approvedApplicationsKey]);
    const declinedApplications = JsonData.map(item => item["Declined Applications"]);

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,  // Dynamic x-axis values
        datasets: [
          {
            type: 'bar',
            label: 'Approved Applications',
            data: approvedApplications,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            yAxisID: 'y', // Left y-axis for Approved Applications
          },
          {
            type: 'line',
            label: 'Declined Applications',
            data: declinedApplications,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            yAxisID: 'y1', // Right y-axis for Declined Applications
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xaxisValueKey,  // X-axis title
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Approved Applications',
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Declined Applications',
            },
            grid: {
              drawOnChartArea: false, // Avoid overlapping grid lines
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Applications (Based on ${dateFrequency})`,
          },
        },
      },
    });

    // Clean up the chart on component unmount
    return () => {
      myChart.destroy();
    };
  }, [JsonData, approvedApplicationsKey, xaxisValueKey, dateFrequency]);  // Dependency array ensures chart updates when props change

  return <canvas ref={chartRef} />;
};

export default DualAxisChart;
