import React, { useState } from "react";
import "./CohortTable.css";

const CohortTable = ({ data, kpiList, dimensions, additionalColumn }) => {
  const [selectedKPI, setSelectedKPI] = useState("Select All"); // Default to "Select All"
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);

  // Function to filter and group data based on the selected KPI and dimension
  const filterData = () => {
    const groupedData = {};
    data.forEach((entry) => {
      const dimensionValue = entry[selectedDimension];
      const mob = entry["month on books"];
      const additionalValue = additionalColumn ? entry[additionalColumn] : null;

      if (!groupedData[mob]) groupedData[mob] = {};

      if (selectedKPI === "Select All") {
        // Group data by KPI names
        kpiList.forEach((kpi) => {
          if (!groupedData[mob][kpi]) groupedData[mob][kpi] = {};
          if (!groupedData[mob][kpi][dimensionValue]) {
            groupedData[mob][kpi][dimensionValue] = { values: {}, additional: additionalValue };
          }
          groupedData[mob][kpi][dimensionValue].values = {
            ...groupedData[mob][kpi][dimensionValue].values,
            [mob]: entry[kpi] || 0,
          };
        });
      } else {
        // Group data by the selected KPI and dimension
        if (!groupedData[mob][selectedKPI]) groupedData[mob][selectedKPI] = {};
        if (!groupedData[mob][selectedKPI][dimensionValue]) {
          groupedData[mob][selectedKPI][dimensionValue] = { values: {}, additional: additionalValue };
        }
        groupedData[mob][selectedKPI][dimensionValue].values[mob] = entry[selectedKPI];
      }
    });

    return groupedData;
  };

  const groupedData = filterData();
  const allMOBs = Object.keys(groupedData).sort((a, b) => a - b);

  return (
    <div>
      <div className="dropdowns">
        <label>
          Select KPI:
          <select
            value={selectedKPI}
            onChange={(e) => setSelectedKPI(e.target.value)}
          >
            <option value="Select All">Select All</option> {/* Add Select All option */}
            {kpiList.map((kpi, idx) => (
              <option key={idx} value={kpi}>
                {kpi}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Dimension:
          <select
            value={selectedDimension}
            onChange={(e) => setSelectedDimension(e.target.value)}
          >
            {dimensions.map((dim, idx) => (
              <option key={idx} value={dim}>
                {dim}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table className="cohort-table">
        <thead>
          <tr>
            <th>KPI</th> {/* Changed from Metrics to KPI */}
            {additionalColumn && <th>{additionalColumn}</th>} {/* Additional column */}
            <th>Dimension</th>
            <th colSpan={allMOBs.length}>MOB</th> {/* MOB spans across all columns */}
          </tr>
          <tr>
            <th></th>
            {additionalColumn && <th></th>}
            <th></th>
            {allMOBs.map((mob, idx) => (
              <th key={idx}>{mob}</th> {/* Display 0, 1, 2 under MOB */}
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedKPI === "Select All"
            ? // If "Select All", display each KPI grouped with its data
              kpiList.map((kpi, kpiIdx) => (
                <React.Fragment key={kpiIdx}>
                  {Object.keys(groupedData[allMOBs[0]][kpi]).map(
                    (dimensionValue, dimIdx) => (
                      <tr key={`${kpiIdx}-${dimIdx}`}>
                        {dimIdx === 0 && (
                          <td rowSpan={Object.keys(groupedData[allMOBs[0]][kpi]).length}>
                            {kpi}
                          </td>
                        )}
                        {additionalColumn && (
                          <td>
                            {groupedData[allMOBs[0]][kpi][dimensionValue]?.additional || "-"}
                          </td>
                        )}
                        <td>{dimensionValue}</td>
                        {allMOBs.map((mob) => (
                          <td key={mob}>
                            {groupedData[mob][kpi]?.[dimensionValue]?.values[mob]?.toLocaleString() || "-"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))
            : // If a specific KPI is selected, display its grouped data
              Object.keys(groupedData[allMOBs[0]][selectedKPI]).map(
                (dimensionValue, dimIdx) => (
                  <tr key={dimIdx}>
                    {dimIdx === 0 && (
                      <td rowSpan={Object.keys(groupedData[allMOBs[0]][selectedKPI]).length}>
                        {selectedKPI}
                      </td>
                    )}
                    {additionalColumn && (
                      <td>
                        {groupedData[allMOBs[0]][selectedKPI][dimensionValue]?.additional || "-"}
                      </td>
                    )}
                    <td>{dimensionValue}</td>
                    {allMOBs.map((mob) => (
                      <td key={mob}>
                        {groupedData[mob][selectedKPI]?.[dimensionValue]?.values[mob]?.toLocaleString() || "-"}
                      </td>
                    ))}
                  </tr>
                )
              )}
        </tbody>
      </table>
    </div>
  );
};

export default CohortTable;
