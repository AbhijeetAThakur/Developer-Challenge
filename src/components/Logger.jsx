import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import Table from "./Table";

const url = "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f";

const Logger = () => {
  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(url);
        const json = await res.json();
        setData(json?.result?.auditLog);
        setFilterData(json?.result?.auditLog);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const applicationTypes = [...new Set(data?.map(({ applicationType }) => applicationType))].filter(Boolean);
  const actionTypes = [...new Set(data?.map(({ actionType }) => actionType))].filter(Boolean);

  const applicationTypesOptions = applicationTypes.map((item) => ({ value: item, label: item }));
  const actionTypesOptions = actionTypes.map((item) => ({ value: item, label: item }));

  return (
    <>
      <Filter
        applicationTypes={applicationTypesOptions}
        actionTypes={actionTypesOptions}
        setFilterData={setFilterData}
        data={data}
      />
      <div className="d-flex justify-content-center">
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading...</p>}
      </div>
      {data && <Table isLoading={isLoading} filterData={filterData} />}
    </>
  );
};

export default Logger;
