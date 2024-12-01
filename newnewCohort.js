import React, { useState } from "react";
import "./CohortTable.css";

const CohortTable = ({ data, kpiList, dimensions, additionalColumns }) => {
  const initializeFilters = (columns) => {
    const filters = {};
    columns.forEach((col) => {
      filters[col] = "All";
    });
    return filters;
  };

  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);
  const [additionalColumnFilters, setAdditionalColumnFilters] = useState(
    initializeFilters(additionalColumns)
  );

  const filterData = () => {
    const groupedData = {};
    data.forEach((entry) => {
      const isMatch = additionalColumns.every(
        (col) =>
          additionalColumnFilters[col] === "All" ||
          entry[col] === additionalColumnFilters[col]
      );
      if (!isMatch) return;

      const dimensionValue = entry[selectedDimension];
      const mob = entry["month on books"];

      if (!groupedData[mob]) groupedData[mob] = {};

      if (selectedKPI === "Select All") {
        kpiList.forEach((kpi) => {
          if (!groupedData[mob][kpi]) groupedData[mob][kpi] = {};
          groupedData[mob][kpi][dimensionValue] = entry[kpi] || 0;
        });
      } else {
        if (!groupedData[mob][selectedKPI]) groupedData[mob][selectedKPI] = {};
        groupedData[mob][selectedKPI][dimensionValue] = entry[selectedKPI];
      }
    });

    return groupedData;
  };

  const [selectedKPI, setSelectedKPI] = useState("Select All");
  const groupedData = filterData();
  const allMOBs = Object.keys(groupedData).sort((a, b) => a - b);

  const handleAdditionalColumnChange = (col, value) => {
    setAdditionalColumnFilters((prevFilters) => ({
      ...prevFilters,
      [col]: value,
    }));
  };

  return (
    <div>
      <div className="dropdowns">
        <label>
          Select Metrics:
          <select
            value={selectedKPI}
            onChange={(e) => setSelectedKPI(e.target.value)}
          >
            <option value="Select All">Select All</option>
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
        {additionalColumns.map((col) => (
          <label key={col}>
            {col}:
            <select
              onChange={(e) => handleAdditionalColumnChange(col, e.target.value)}
            >
              <option value="All">All</option>
              {[...new Set(data.map((item) => item[col]))].map((value, idx) => (
                <option key={idx} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <table className="cohort-table">
        <thead>
          <tr>
            <th>Metrics</th>
            {additionalColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Dimension</th>
            <th colSpan={allMOBs.length}>MOB</th>
          </tr>
          <tr>
            <th></th>
            {additionalColumns.map((col) => (
              <th key={col}></th>
            ))}
            <th></th>
            {allMOBs.map((mob, idx) => (
              <th key={idx}>{mob}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedKPI === "Select All"
            ? Object.keys(groupedData[allMOBs[0]]).map((kpi, kpiIdx) => (
                <React.Fragment key={kpiIdx}>
                  {Object.keys(groupedData[allMOBs[0]][kpi]).map(
                    (dimensionValue, dimIdx) => (
                      <tr key={`${kpi}-${dimensionValue}`}>
                        {dimIdx === 0 && (
                          <td
                            rowSpan={
                              Object.keys(groupedData[allMOBs[0]][kpi]).length
                            }
                          >
                            {kpi}
                          </td>
                        )}
                        {additionalColumns.map((col) => (
                          <td key={col}>
                            {data.find(
                              (item) =>
                                item[selectedDimension] === dimensionValue &&
                                item["month on books"] ===
                                  parseInt(allMOBs[0])
                            )?.[col] || "-"}
                          </td>
                        ))}
                        <td>{dimensionValue}</td>
                        {allMOBs.map((mob) => (
                          <td key={`${kpi}-${dimensionValue}-${mob}`}>
                            {groupedData[mob][kpi]?.[dimensionValue]?.toLocaleString() || "-"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))
            : Object.keys(groupedData[allMOBs[0]][selectedKPI]).map(
                (dimensionValue, dimIdx) => (
                  <tr key={dimIdx}>
                    {dimIdx === 0 && (
                      <td
                        rowSpan={
                          Object.keys(
                            groupedData[allMOBs[0]][selectedKPI]
                          ).length
                        }
                      >
                        {selectedKPI}
                      </td>
                    )}
                    {additionalColumns.map((col) => (
                      <td key={col}>
                        {data.find(
                          (item) =>
                            item[selectedDimension] === dimensionValue &&
                            item["month on books"] === parseInt(allMOBs[0])
                        )?.[col] || "-"}
                      </td>
                    ))}
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
