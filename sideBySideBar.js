import React, {useState} from 'react';
import Chart from 'chart.js/auto';

const sampleData = [
  {
    name: "Portfolio A",
    month: "Jan",
    values: [1000, 1200, 1500],
  },
  // ... Rest of the sample data as provided earlier ...
];

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

export function App(props) {

  const [chartData, setChartData] = useState({
    labels: sampleData.map((portfolio) => portfolio.month),
    datasets: sampleData.map((portfolio) => ({
      label: portfolio.name,
      data: portfolio.values,
      backgroundColor: getRandomColor(),
      borderColor: 'black',
      borderWidth: 1,
    })),
  });

  

  const chartOptions = {
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2>Portfolio Performance (Side-by-Side)</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

// Log to console
console.log('Hello console')
