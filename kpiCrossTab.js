import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { formatNumberWithKMB, calculateYoY, highlightCell } from "./utils";

const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CrossTab = ({ data, kpiList, dimensions, yAxisValueKey }) => {
  const [dateView, setDateView] = useState("month"); // 'month' or 'year'
  const [yoyView, setYoyView] = useState("actual"); // 'actual' or 'percentage'

  const handleDateChange = (event) => setDateView(event.target.value);
  const handleYoyChange = (event, newView) => setYoyView(newView);

  const parseDate = (dateString) => new Date(dateString);
  const getYear = (date) => date.getFullYear();
  const getMonth = (date) =>
    date.toLocaleString("default", { month: "long" });

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const organizeData = () => {
    const groupedData = {};
    const columns = new Set();

    data.forEach((row) => {
      const date = parseDate(row["decision date"]);
      const year = getYear(date);
      const month = getMonth(date);

      if (dateView === "month" && year === currentYear) {
        columns.add(month);
      } else if (dateView === "year") {
        columns.add(currentYear);
        columns.add(previousYear);
      }

      const dimensionKey = dimensions.map((d) => row[d] || "N/A").join("-");
      if (!groupedData[dimensionKey]) {
        groupedData[dimensionKey] = { KPIs: {} };
      }

      yAxisValueKey.forEach((kpi) => {
        if (!groupedData[dimensionKey].KPIs[kpi]) {
          groupedData[dimensionKey].KPIs[kpi] = {
            currentYearData: {},
            previousYearData: {},
            currentYearCumulative: 0,
            previousYearCumulative: 0,
          };
        }

        if (year === currentYear) {
          groupedData[dimensionKey].KPIs[kpi].currentYearData[month] =
            row[kpi];
          groupedData[dimensionKey].KPIs[kpi].currentYearCumulative +=
            row[kpi];
        } else if (year === previousYear) {
          groupedData[dimensionKey].KPIs[kpi].previousYearData[month] =
            row[kpi];
          groupedData[dimensionKey].KPIs[kpi].previousYearCumulative +=
            row[kpi];
        }
      });
    });

    return {
      groupedData,
      columns: Array.from(columns).sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
      ),
    };
  };

  const getCrossTabData = () => {
    const { groupedData, columns } = organizeData();
    const result = [];

    for (const [dimensionKey, { KPIs }] of Object.entries(groupedData)) {
      for (const [kpi, metrics] of Object.entries(KPIs)) {
        const dimensionValues = dimensionKey.split("-");
        result.push({ dimensionValues, kpi, metrics });
      }
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
        <ToggleButton value="actual" aria-label="Actual">
          Actual
        </ToggleButton>
        <ToggleButton value="percentage" aria-label="Percentage">
          YoY %
        </ToggleButton>
      </ToggleButtonGroup>

      <Table>
        <TableHead>
          <TableRow>
            {dimensions.map((dimension, index) => (
              <TableCell key={index}>{dimension}</TableCell>
            ))}
            <TableCell>KPI</TableCell>
            {columns.map((col, index) => (
              <TableCell key={index}>
                {dateView === "month" ? col : `Year ${col}`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {crossTabData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.dimensionValues.map((value, index) => (
                <TableCell key={index}>{value}</TableCell>
              ))}
              <TableCell>{row.kpi}</TableCell>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} style={highlightCell(row.metrics[col] || 0)}>
                  {dateView === "month" ? (
                    yoyView === "actual"
                      ? formatNumberWithKMB(
                          row.metrics.currentYearData[col] || 0
                        )
                      : calculateYoY(
                          row.metrics.currentYearData[col] || 0,
                          row.metrics.previousYearData[col] || 0
                        )
                  ) : yoyView === "actual" ? (
                    formatNumberWithKMB(
                      col === currentYear
                        ? row.metrics.currentYearCumulative
                        : row.metrics.previousYearCumulative
                    )
                  ) : (
                    calculateYoY(
                      row.metrics.currentYearCumulative,
                      row.metrics.previousYearCumulative
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CrossTab;
