import React, { useState } from "react";
import "./CohortTable.css";

const CohortTable = ({ data, kpiList, dimensions }) => {
  const [selectedKPI, setSelectedKPI] = useState("Select All"); // Default to "Select All"
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);

  // Function to filter and group data based on the selected KPI and dimension
  const filterData = () => {
    const groupedData = {};
    data.forEach((entry) => {
      const dimensionValue = entry[selectedDimension];
      const mob = entry["month on books"];

      if (!groupedData[mob]) groupedData[mob] = {};

      if (selectedKPI === "Select All") {
        // Group data by KPI names
        kpiList.forEach((kpi) => {
          if (!groupedData[mob][kpi]) groupedData[mob][kpi] = {};
          groupedData[mob][kpi][dimensionValue] = entry[kpi] || 0;
        });
      } else {
        // Group data by the selected KPI and dimension
        if (!groupedData[mob][selectedKPI]) groupedData[mob][selectedKPI] = {};
        groupedData[mob][selectedKPI][dimensionValue] = entry[selectedKPI];
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
            <th>Dimension</th>
            <th colSpan={allMOBs.length}>MOB</th> {/* MOB spans across all columns */}
          </tr>
          <tr>
            <th></th>
            <th></th>
            {allMOBs.map((mob, idx) => (
              <th key={idx}>{mob}</th> {/* Display 0, 1, 2 under MOB */}
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedKPI === "Select All"
            ? // If "Select All", display each KPI grouped with its data
              Object.keys(groupedData[allMOBs[0]]).map((kpi, kpiIdx) => (
                <React.Fragment key={kpiIdx}>
                  <tr>
                    <td rowSpan={Object.keys(groupedData[allMOBs[0]][kpi]).length}>
                      {kpi}
                    </td>
                    {Object.keys(groupedData[allMOBs[0]][kpi]).map((dimensionValue, dimIdx) => (
                      <React.Fragment key={dimIdx}>
                        {dimIdx > 0 ? (
                          <tr>
                            <td>{dimensionValue}</td>
                            {allMOBs.map((mob) => (
                              <td key={mob}>
                                {groupedData[mob][kpi]?.[dimensionValue]?.toLocaleString() || "-"}
                              </td>
                            ))}
                          </tr>
                        ) : (
                          <React.Fragment>
                            <td>{dimensionValue}</td>
                            {allMOBs.map((mob) => (
                              <td key={mob}>
                                {groupedData[mob][kpi]?.[dimensionValue]?.toLocaleString() || "-"}
                              </td>
                            ))}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
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
                    <td>{dimensionValue}</td>
                    {allMOBs.map((mob) => (
                      <td key={mob}>
                        {groupedData[mob][selectedKPI]?.[dimensionValue]?.toLocaleString() || "-"}
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

.cohort-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.cohort-table th, .cohort-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.cohort-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-transform: uppercase;
}

.cohort-table thead th[colspan] {
  text-align: center;
}

.cohort-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.cohort-table tbody tr:hover {
  background-color: #f1f1f1;
}

.cohort-table th:first-child,
.cohort-table td:first-child {
  text-align: left;
  font-weight: bold;
  background-color: #fafafa;
}

.cohort-table th:nth-child(2),
.cohort-table td:nth-child(2) {
  text-align: left;
}

.cohort-table tbody td {
  white-space: nowrap;
}

.cohort-table thead tr:nth-child(2) th {
  border-top: 2px solid #000;
}

.cohort-table .dropdowns {
  margin-bottom: 15px;
}

.cohort-table .dropdowns label {
  margin-right: 15px;
  font-weight: bold;
  font-size: 14px;
}

.cohort-table select {
  padding: 5px;
  font-size: 14px;
}

.cohort-table th[colspan] {
  text-transform: none;
  font-weight: normal;
  font-size: 13px;
}


