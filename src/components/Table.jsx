import React, { useState } from "react";
import "../App.css";
function Table({ filterData }) {
  const [sortBy, setSortBy] = useState("logId");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(column);
      setSortAscending(true);
    }
  };

  const sortedData = filterData.sort((a, b) => {
    if (sortAscending) {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const pages = Math.ceil(filterData.length / perPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("logId")}>
              Log ID <i className="fa fa-sort"></i>
            </th>
            <th onClick={() => handleSort("applicationType")}>
              Application Type <i className="fa fa-sort"></i>
            </th>
            <th onClick={() => handleSort("applicationId")}>
              Application ID <i className="fa fa-sort"></i>
            </th>
            <th onClick={() => handleSort("actionType")}>
              Action Type <i className="fa fa-sort"></i>
            </th>
            <th onClick={() => handleSort("creationTimestamp")}>
              Date/Time <i className="fa fa-sort"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index}>
                <td>{item.logId}</td>
                <td>{item.applicationType}</td>
                <td>{item.applicationId}</td>
                <td>{item.actionType}</td>
                <td>{item.creationTimestamp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No Record Found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "25px" }}>
        Page {currentPage} of {pages}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
