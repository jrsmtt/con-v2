import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  ToggleButton, ToggleButtonGroup, Radio, RadioGroup, FormControlLabel,
  Checkbox, FormControl, FormLabel, Paper, Typography
} from '@mui/material';
import { formatNumberWithKMB, calculateYoY, highlightCell } from './utils';

const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

const CrossTab = ({ data, yAxisValueKey, dimensions }) => {
  const [dateView, setDateView] = useState('month'); // 'month' or 'year'
  const [yoyView, setYoyView] = useState('actual'); // 'actual' or 'percentage'
  const [yearFilter, setYearFilter] = useState({ current: true, previous: true }); // Year toggle state

  const handleDateChange = (event) => setDateView(event.target.value);
  const handleYoyChange = (event, newView) => setYoyView(newView);
  const handleYearFilterChange = (event) => {
    setYearFilter({
      ...yearFilter,
      [event.target.name]: event.target.checked,
    });
  };

  const parseDate = (dateString) => new Date(dateString);
  const getYear = (date) => date.getFullYear();
  const getMonth = (date) => date.toLocaleString('default', { month: 'long' });

  // Get currentYear as the max year from data, and previousYear
  const allYears = data.map(row => getYear(parseDate(row['decision date'])));
  const currentYear = Math.max(...allYears);
  const previousYear = currentYear - 1;

  // Get the max month available in currentYear
  const currentYearMonths = data
    .filter(row => getYear(parseDate(row['decision date'])) === currentYear)
    .map(row => getMonth(parseDate(row['decision date'])));
  const maxMonthIndex = Math.max(...currentYearMonths.map(month => monthOrder.indexOf(month)));

  // Organize data
  const organizeData = () => {
    const groupedData = {};
    const columns = new Set();

    data.forEach(row => {
      const date = parseDate(row['decision date']);
      const year = getYear(date);
      const month = getMonth(date);

      // Filter months exceeding the max month of the current year
      if (monthOrder.indexOf(month) > maxMonthIndex) return;

      // Add months as columns only for month view
      if (dateView === 'month' && year === currentYear) {
        columns.add(month);
      } else if (dateView === 'year') {
        columns.add(currentYear);
        columns.add(previousYear);
      }

      const dimensionKey = dimensions.map(d => row[d] || 'N/A').join('-');
      if (!groupedData[dimensionKey]) {
        groupedData[dimensionKey] = {
          kpiData: {},
          currentYearCumulative: {},
          previousYearCumulative: {}
        };
      }

      // Process KPIs for the current dimension
      yAxisValueKey.forEach(kpi => {
        const kpiName = kpi.kpi_name;
        if (!groupedData[dimensionKey].kpiData[kpiName]) {
          groupedData[dimensionKey].kpiData[kpiName] = { currentYearData: {}, previousYearData: {} };
          groupedData[dimensionKey].currentYearCumulative[kpiName] = 0;
          groupedData[dimensionKey].previousYearCumulative[kpiName] = 0;
        }

        if (year === currentYear) {
          groupedData[dimensionKey].kpiData[kpiName].currentYearData[month] = row[kpiName] || 0;
          groupedData[dimensionKey].currentYearCumulative[kpiName] += row[kpiName] || 0;
        } else if (year === previousYear) {
          groupedData[dimensionKey].kpiData[kpiName].previousYearData[month] = row[kpiName] || 0;
          groupedData[dimensionKey].previousYearCumulative[kpiName] += row[kpiName] || 0;
        }
      });
    });

    return { groupedData, columns: Array.from(columns).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)) };
  };

  const getCrossTabData = () => {
    const { groupedData, columns } = organizeData();
    const result = [];

    for (const [dimensionKey, metrics] of Object.entries(groupedData)) {
      const dimensionValues = dimensionKey.split('-');
      const row = { dimensionValues, metrics };
      result.push(row);
    }

    return { result, columns };
  };

  const { result: crossTabData, columns } = getCrossTabData();

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6">Select Date View</Typography>
      <RadioGroup row value={dateView} onChange={handleDateChange}>
        <FormControlLabel value="month" control={<Radio />} label="Month" />
        <FormControlLabel value="year" control={<Radio />} label="Year" />
      </RadioGroup>

      <Typography variant="h6">View Mode</Typography>
      <ToggleButtonGroup
        value={yoyView}
        exclusive
        onChange={handleYoyChange}
        aria-label="view mode"
      >
        <ToggleButton value="actual" aria-label="Actual">Actual</ToggleButton>
        <ToggleButton value="percentage" aria-label="Percentage">YoY %</ToggleButton>
      </ToggleButtonGroup>

      <FormControl component="fieldset">
        <FormLabel component="legend">Select Year(s)</FormLabel>
        <FormControlLabel
          control={<Checkbox checked={yearFilter.current} onChange={handleYearFilterChange} name="current" />}
          label={`Current Year (${currentYear})`}
        />
        <FormControlLabel
          control={<Checkbox checked={yearFilter.previous} onChange={handleYearFilterChange} name="previous" />}
          label={`Previous Year (${previousYear})`}
        />
      </FormControl>

      <Table>
        <TableHead>
          <TableRow>
            {dimensions.map((dimension, index) => (
              <TableCell key={index}>{dimension}</TableCell>
            ))}
            <TableCell>KPI</TableCell>
            {columns.map((col, index) => (
              <TableCell key={index}>{dateView === 'month' ? col : `Year ${col}`}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {crossTabData.map((row, rowIndex) => (
            yAxisValueKey.map((kpi, kpiIndex) => (
              <TableRow key={`${rowIndex}-${kpiIndex}`}>
                {row.dimensionValues.map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
                <TableCell>{kpi.kpi_name}</TableCell>
                {columns.map((col, colIndex) => {
                  const isCurrentYear = col === currentYear || monthOrder.indexOf(col) <= maxMonthIndex;
                  const isPreviousYear = col === previousYear;

                  if ((isCurrentYear && yearFilter.current) || (isPreviousYear && yearFilter.previous)) {
                    return (
                      <TableCell key={colIndex} style={highlightCell(row.metrics.kpiData[kpi.kpi_name]?.[col] || 0)}>
                        {dateView === 'month'
                          ? formatNumberWithKMB(row.metrics.kpiData[kpi.kpi_name]?.currentYearData[col] || 0)
                          : formatNumberWithKMB(
                              col === currentYear
                                ? row.metrics.currentYearCumulative[kpi.kpi_name]
                                : row.metrics.previousYearCumulative[kpi.kpi_name]
                            )}
                      </TableCell>
                    );
                  }
                  return null;
                })}
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CrossTab;
