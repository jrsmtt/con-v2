import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { DateTime } from 'luxon';  // Optionally used to handle different date formats

const StackedBarChartWithPortfolio = ({ JsonData, approvedApplicationsKey, xaxisValueKey, portfolioKey, dateFrequency }) => {
  const chartRef = useRef(null);
  const [showYoY, setShowYoY] = useState(false); // Toggle state for YoY view

  // Helper function to handle date formatting based on frequency
  const formatDate = (date) => {
    switch (dateFrequency) {
      case 'daily':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy-LL-dd');
      case 'monthly':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy-LL');
      case 'yearly':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy');
      default:
        return date; // Default to the provided format
    }
  };

  // Helper function to extract year from date
  const extractYear = (date) => {
    return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy');
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Get all years from the dataset
    const years = Array.from(new Set(JsonData.map(item => extractYear(item[xaxisValueKey]))));
    const currentYear = Math.max(...years); // Find the latest year
    const previousYear = currentYear - 1;

    // Extract data for current and previous year
    const currentYearData = JsonData.filter(item => extractYear(item[xaxisValueKey]) === `${currentYear}`);
    const previousYearData = JsonData.filter(item => extractYear(item[xaxisValueKey]) === `${previousYear}`);

    // Create labels based on the current year's data
    const labels = currentYearData.map(item => formatDate(item[xaxisValueKey]));

    // Get the unique portfolios from the data
    const portfolios = Array.from(new Set(JsonData.map(item => item[portfolioKey])));

    // Prepare datasets grouped by Portfolio for both current and previous year
    const datasets = portfolios.map(portfolio => {
      return {
        label: `Approved Applications - ${portfolio} (Current Year)`,
        data: currentYearData
          .filter(item => item[portfolioKey] === portfolio)
          .map(item => item[approvedApplicationsKey]),
        backgroundColor: getColorByPortfolio(portfolio), // Assign different colors for each portfolio
        stack: 'current',  // Group all current year portfolios under the same stack
      };
    });

    // Add previous year portfolio data to the dataset (optional, depending on toggle)
    if (showYoY) {
      portfolios.forEach(portfolio => {
        datasets.push({
          label: `Approved Applications - ${portfolio} (Previous Year)`,
          data: previousYearData
            .filter(item => item[portfolioKey] === portfolio)
            .map(item => item[approvedApplicationsKey]),
          backgroundColor: getColorByPortfolio(portfolio, true), // Darker color for previous year portfolios
          stack: 'previous', // Group all previous year portfolios under the same stack
        });
      });
    }

    const myChart = new Chart(ctx, {
      type: 'bar',  // Bar chart
      data: {
        labels: labels, // Dynamic x-axis labels (only for the current year)
        datasets: datasets,
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
            stacked: true,  // Enable stacking for x-axis (stack bars)
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Approved Applications',
            },
            stacked: true,  // Enable stacking for y-axis (stack portfolios)
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
            onClick: (e, legendItem, legend) => {
              const index = legendItem.datasetIndex;  // Get the dataset index
              const ci = legend.chart;  // Reference to the chart instance
              const meta = ci.getDatasetMeta(index);  // Get metadata of the clicked dataset

              // Toggle the hidden property of the clicked dataset
              meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

              ci.update(); // Update the chart to apply changes
            },
          },
          title: {
            display: true,
            text: `Applications by Portfolio (Based on ${dateFrequency})`,
          },
        },
      },
    });

    // Clean up the chart on component unmount
    return () => {
      myChart.destroy();
    };
  }, [JsonData, approvedApplicationsKey, xaxisValueKey, portfolioKey, dateFrequency, showYoY]);  // Dependency array ensures chart updates when props change

  // Helper function to assign colors by portfolio
  const getColorByPortfolio = (portfolio, darken = false) => {
    const colors = {
      BB: 'rgba(75, 192, 192, 0.6)',
      CB: 'rgba(153, 102, 255, 0.6)',
      LL: 'rgba(255, 159, 64, 0.6)',
      // Add more portfolios and colors as needed
    };

    const color = colors[portfolio] || 'rgba(201, 203, 207, 0.6)';  // Default color
    return darken ? color.replace('0.6', '0.4') : color;  // Darken color for previous year
  };

  return (
    <div style={{ position: 'relative', marginTop: '50px' }}>
      <div style={{ position: 'absolute', top: '-50px', left: '0' }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={showYoY}
            onChange={() => setShowYoY(!showYoY)}
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: '10px' }}>
          {showYoY ? 'Show Current Year' : 'Show YoY Change'}
        </span>
      </div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default StackedBarChartWithPortfolio;



















import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { DateTime } from 'luxon';  // Optionally used to handle different date formats

const YoYBarChartWithToggle = ({ JsonData, approvedApplicationsKey, xaxisValueKey, portfolioKey, dateFrequency }) => {
  const chartRef = useRef(null);
  const [showYoY, setShowYoY] = useState(false); // Toggle state for YoY view

  // Helper function to handle date formatting based on frequency
  const formatDate = (date) => {
    switch (dateFrequency) {
      case 'daily':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy-LL-dd');
      case 'monthly':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy-LL');
      case 'yearly':
        return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy');
      default:
        return date; // Default to the provided format
    }
  };

  // Helper function to extract year from date
  const extractYear = (date) => {
    return DateTime.fromFormat(date, 'yyyy-MM-dd HH:mm:ss').toFormat('yyyy');
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Get all years from the dataset
    const years = Array.from(new Set(JsonData.map(item => extractYear(item[xaxisValueKey]))));
    const currentYear = Math.max(...years); // Find the latest year
    const previousYear = currentYear - 1;

    // Extract data for current and previous year
    const currentYearData = JsonData.filter(item => extractYear(item[xaxisValueKey]) === `${currentYear}`);
    const previousYearData = JsonData.filter(item => extractYear(item[xaxisValueKey]) === `${previousYear}`);

    // Create labels based on the current year's data
    const labels = currentYearData.map(item => formatDate(item[xaxisValueKey]));

    // Get all unique portfolios from the data
    const portfolios = Array.from(new Set(JsonData.map(item => item[portfolioKey])));

    // Prepare datasets grouped by Portfolio for both current and previous year
    const currentYearDatasets = portfolios.map(portfolio => {
      return {
        label: `Approved Applications - ${portfolio} (Current Year)`,
        data: labels.map(label => {
          // Find data for the current label and portfolio
          const entry = currentYearData.find(item => formatDate(item[xaxisValueKey]) === label && item[portfolioKey] === portfolio);
          return entry ? entry[approvedApplicationsKey] : 0;
        }),
        backgroundColor: getColorByPortfolio(portfolio),
        stack: 'current',  // Group all current year portfolios under the same stack
      };
    });

    // Add previous year portfolio data (optional based on toggle)
    let previousYearDatasets = [];
    if (showYoY) {
      previousYearDatasets = portfolios.map(portfolio => {
        return {
          label: `Approved Applications - ${portfolio} (Previous Year)`,
          data: labels.map(label => {
            // Find data for the current label and portfolio
            const entry = previousYearData.find(item => formatDate(item[xaxisValueKey]) === label && item[portfolioKey] === portfolio);
            return entry ? entry[approvedApplicationsKey] : 0;
          }),
          backgroundColor: getColorByPortfolio(portfolio, true), // Darker color for previous year portfolios
          stack: 'previous',  // Group all previous year portfolios under the same stack
        };
      });
    }

    const myChart = new Chart(ctx, {
      type: 'bar',  // Bar chart
      data: {
        labels: labels, // Dynamic x-axis labels
        datasets: [...currentYearDatasets, ...previousYearDatasets],  // Combine both current and previous year datasets
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
            stacked: true,  // Enable stacking for x-axis (stack bars)
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Approved Applications',
            },
            stacked: true,  // Enable stacking for y-axis (stack portfolios)
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
            onClick: (e, legendItem, legend) => {
              const index = legendItem.datasetIndex;  // Get the dataset index
              const ci = legend.chart;  // Reference to the chart instance
              const meta = ci.getDatasetMeta(index);  // Get metadata of the clicked dataset

              // Toggle the hidden property of the clicked dataset
              meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

              ci.update(); // Update the chart to apply changes
            },
          },
          title: {
            display: true,
            text: `Applications by Portfolio (Based on ${dateFrequency})`,
          },
        },
      },
    });

    // Clean up the chart on component unmount
    return () => {
      myChart.destroy();
    };
  }, [JsonData, approvedApplicationsKey, xaxisValueKey, portfolioKey, dateFrequency, showYoY]);  // Dependency array ensures chart updates when props change

  // Helper function to assign colors by portfolio
  const getColorByPortfolio = (portfolio, darken = false) => {
    const colors = {
      BB: 'rgba(75, 192, 192, 0.6)',
      CB: 'rgba(153, 102, 255, 0.6)',
      LL: 'rgba(255, 159, 64, 0.6)',
      // Add more portfolios and colors as needed
    };

    const color = colors[portfolio] || 'rgba(201, 203, 207, 0.6)';  // Default color
    return darken ? color.replace('0.6', '0.4') : color;  // Darken color for previous year
  };

  return (
    <div style={{ position: 'relative', marginTop: '50px' }}>
      <div style={{ position: 'absolute', top: '-50px', left: '0' }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={showYoY}
            onChange={() => setShowYoY(!showYoY)}
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: '10px' }}>
          {showYoY ? 'Show Current Year' : 'Show YoY Change'}
        </span>
      </div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default YoYBarChartWithToggle;

