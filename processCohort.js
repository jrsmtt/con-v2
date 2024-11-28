const processCohortData = (data, dimension, kpiList) => {
  const cohorts = {};

  data.forEach((entry) => {
    const cohort = entry[dimension];
    const month = entry["month on books"];

    if (!cohorts[cohort]) {
      cohorts[cohort] = {
        cohort,
        totalAccounts: {},
        metrics: kpiList.reduce((acc, kpi) => {
          acc[kpi] = {};
          return acc;
        }, {}),
      };
    }

    kpiList.forEach((kpi) => {
      cohorts[cohort].metrics[kpi][month] = entry[kpi];
      if (month === 0) {
        cohorts[cohort].totalAccounts[kpi] = entry[kpi]; // Total at Month 0
      }
    });
  });

  return Object.values(cohorts);
};



import React from "react";
import "./CohortTable.css";

const CohortTable = ({ data, kpiList }) => {
  return (
    <div className="cohort-table-container">
      <table className="cohort-table">
        <thead>
          <tr>
            <th>Cohort</th>
            <th>KPI</th>
            {[...Array(Object.keys(data[0].metrics[kpiList[0]]).length).keys()].map((month) => (
              <th key={month}>Month {month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cohort) =>
            kpiList.map((kpi) => (
              <tr key={`${cohort.cohort}-${kpi}`}>
                <td>{cohort.cohort}</td>
                <td>{kpi}</td>
                {Object.values(cohort.metrics[kpi]).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CohortTable;





import React from "react";
import CohortTable from "./components/CohortTable";

function App() {
  const rawData = [
    { "month on books": 0, "aqc year month": "2023-01", "open acc": 645305, declined: 12345 },
    { "month on books": 1, "aqc year month": "2023-01", "open acc": 600000, declined: 10000 },
    { "month on books": 2, "aqc year month": "2023-01", "open acc": 550000, declined: 8000 },
    { "month on books": 0, "aqc year month": "2023-02", "open acc": 500000, declined: 20000 },
    { "month on books": 1, "aqc year month": "2023-02", "open acc": 450000, declined: 15000 },
    { "month on books": 2, "aqc year month": "2023-02", "open acc": 400000, declined: 12000 },
  ];

  const dimension = "aqc year month";
  const kpiList = ["open acc", "declined"];

  const cohortData = processCohortData(rawData, dimension, kpiList);

  return (
    <div className="App">
      <h1>Cohort Analysis Table</h1>
      <CohortTable data={cohortData} kpiList={kpiList} />
    </div>
  );
}

export default App;



.cohort-table-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.cohort-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  text-align: center;
}

.cohort-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #ddd;
}

.cohort-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.cohort-table tr:nth-child(even) {
  background-color: #f8f8f8;
}

.cohort-table tr:hover {
  background-color: #e6f7ff;
}

.cohort-table .high-value {
  background-color: #a6e3a1;
  font-weight: bold;
  color: #2d6a4f;
}

.cohort-table .mid-value {
  background-color: #f3dd73;
  font-weight: bold;
  color: #9c7400;
}

.cohort-table .low-value {
  background-color: #f9a3a3;
  font-weight: bold;
  color: #9b2226;
}


