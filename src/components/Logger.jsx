import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import Table from "./Table";

const url = "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f";
const Logger = () => {
  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getResponse = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json?.result?.auditLog);
      setFilterData(json?.result?.auditLog);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const applicationTypes = [
    ...new Set(data?.map((entry) => entry.applicationType)),
  ].filter((elements) => {
    return elements !== null;
  });
  const actionTypes = [
    ...new Set(data?.map((entry) => entry.actionType)),
  ].filter((elements) => {
    return elements !== null;
  });
  let applicationTypesOptions = [],
    actionTypesOptions = [];

  applicationTypesOptions = applicationTypes.map((item, index) => {
    return { value: item, label: item };
  });
  actionTypesOptions = actionTypes.map((item, index) => {
    return { value: item, label: item };
  });

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