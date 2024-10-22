import React, { useRef, useEffect, useState } from 'react';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const YoYLineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [showYoY, setShowYoY] = useState(false); // Toggle state for YoY view

  // Function to calculate YoY percentage changes
  const calculateYoYData = (currentYearData, previousYearData) => {
    return currentYearData.map((current, index) => {
      const previous = previousYearData[index] || 0;
      const percentageChange = ((current - previous) / previous) * 100;
      return isFinite(percentageChange) ? percentageChange : 0; // Handle division by zero
    });
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Extract dynamic data
    const years = Array.from(new Set(data.map(item => new Date(item.yr_mth_appl_dt).getFullYear())));

    // Find data for the current and previous year
    const currentYear = Math.max(...years);
    const previousYear = currentYear - 1;

    const currentYearData = data
      .filter(item => new Date(item.yr_mth_appl_dt).getFullYear() === currentYear)
      .map(item => item.Applications);
    const previousYearData = data
      .filter(item => new Date(item.yr_mth_appl_dt).getFullYear() === previousYear)
      .map(item => item.Applications);

    const labels = data
      .filter(item => new Date(item.yr_mth_appl_dt).getFullYear() === currentYear)
      .map(item => new Date(item.yr_mth_appl_dt).toLocaleDateString('en-US', { month: 'short' }));

    const yoyData = calculateYoYData(currentYearData, previousYearData);

    // Define the chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Applications (Current Year)',
          data: currentYearData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          hidden: showYoY, // Hide this dataset when YoY is on
        },
        {
          label: 'YoY Change (%)',
          data: yoyData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          hidden: !showYoY, // Show this dataset when YoY is on
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Applications and YoY Comparison (${previousYear} vs ${currentYear})`,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: showYoY ? 'YoY Change (%)' : 'Applications',
          },
          beginAtZero: true,
        },
      },
    };

    // Initialize or update the chart instance
    if (chartInstance.current) {
      chartInstance.current.data = chartData;
      chartInstance.current.options = options;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options,
      });
    }

    // Cleanup function to destroy the chart on component unmount
    return () => {
      chartInstance.current.destroy();
    };
  }, [showYoY, data]);

  return (
    <div>
      <h2>YoY Line Chart</h2>
      <canvas ref={chartRef} />
      <button onClick={() => setShowYoY(!showYoY)}>
        {showYoY ? 'Show Current Year' : 'Show YoY Change'}
      </button>
    </div>
  );
};

export default YoYLineChart;
