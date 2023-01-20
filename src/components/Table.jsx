import React, { useState } from "react";
import "../App.css";
function Table({ filterData, currentPage, setCurrentPage }) {
  const [sortBy, setSortBy] = useState("logId");
  const [sortAscending, setSortAscending] = useState(true);

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

  const getSortDirection = (id) => {
    let direction = "fa fa-sort";
    if (id === sortBy) {
      direction = sortAscending ? "fa fa-sort-up" : "fa fa-sort-down";
    }
    return direction;
  };

  const pages =
    filterData.length === 0 ? 1 : Math.ceil(filterData.length / perPage);
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
              Log ID <i className={getSortDirection("logId")}></i>
            </th>
            <th onClick={() => handleSort("applicationType")}>
              Application Type{" "}
              <i className={getSortDirection("applicationType")}></i>
            </th>
            <th onClick={() => handleSort("applicationId")}>
              Application ID{" "}
              <i className={getSortDirection("applicationId")}></i>
            </th>
            <th onClick={() => handleSort("actionType")}>
              Action Type <i className={getSortDirection("actionType")}></i>
            </th>
            <th onClick={() => handleSort("creationTimestamp")}>
              Date/Time{" "}
              <i className={getSortDirection("creationTimestamp")}></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.logId}</td>
              <td>{item.applicationType}</td>
              <td>{item.applicationId}</td>
              <td>{item.actionType}</td>
              <td>{item.creationTimestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {paginatedData.length === 0 && (
        <div className="text-center"> No Record Found </div>
      )}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: "25px", width: "100%" }}
      >
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-3"
        >
          Previous
        </button>
        <div>
          Page {currentPage} of {pages}
        </div>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pages}
          className="ml-3"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
