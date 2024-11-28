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

