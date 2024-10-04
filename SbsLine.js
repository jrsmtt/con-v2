import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SideBySideBarLineChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        type: 'bar',
        label: 'Applications',
        data: [100, 200, 300, 400, 500, 600],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Approved Accounts',
        data: [50, 150, 250, 350, 450, 550],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Approval Rate (%)',
        data: [50, 75, 83, 87, 90, 92],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Count',
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
          drawOnChartArea: false, // prevents the grid lines from appearing on the right axis
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SideBySideBarLineChart;









import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SideBySideBarLineChart = () => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy(); // Destroy existing chart before creating new one
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            type: 'bar',
            label: 'Applications',
            data: [100, 200, 300, 400, 500, 600],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Approved Accounts',
            data: [50, 150, 250, 350, 450, 550],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'Approval Rate (%)',
            data: [50, 75, 83, 87, 90, 92],
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1',
          }
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Count',
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
              drawOnChartArea: false, // prevents the grid lines from appearing on the right axis
            },
          },
        },
      },
    });

    // Clean up on component unmount
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default SideBySideBarLineChart;
