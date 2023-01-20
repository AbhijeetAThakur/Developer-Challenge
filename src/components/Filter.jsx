import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
dayjs.extend(isBetween);

const Filter = ({ applicationTypes, actionTypes, setFilterData, data }) => {
  const [selectedApplicationOption, setSelectedApplicationOption] =
    useState("ADD_POA");
  const [selectedActionOption, setSelectedActionOption] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isClearable] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectInputApplicationRef = useRef();
  const selectInputActionRef = useRef();
  const defaultValues = {
    logID: "",
    applicationId: "",
  };
  const [formValues, setFormValues] = useState(defaultValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createParams = (formData) => {
    const searchParams = {};
    for (let [name, value] of formData) {
      if (value) {
        if (name === "fromDate" || name === "toDate") {
          searchParams[name] = dayjs(value).format("YYYY-MM-DD");
        } else {
          searchParams[name] = value;
        }
      }
    }
    return searchParams;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const urlParams = createParams(formData);
    setSearchParams(urlParams);
  };

  const filteredData = useCallback(() => {
    const logID = searchParams.get("logID") || "";
    const applicationType = searchParams.get("applicationType") || "";
    const actionType = searchParams.get("actionType") || "";
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";
    const applicationId = searchParams.get("applicationId") || "";

    return data?.length > 0
      ? data
          ?.filter((tableData) =>
            logID !== ""
              ? tableData?.logId.toString().includes(logID)
              : tableData
          )
          .filter((tableData) =>
            applicationType !== ""
              ? tableData.applicationType === applicationType
              : tableData
          )
          .filter((tableData) =>
            actionType !== "" ? tableData.actionType === actionType : tableData
          )
          .filter((tableData) =>
            applicationId !== ""
              ? tableData?.applicationId?.toString().includes(applicationId)
              : tableData
          )
          .filter((tableData) => {
            return fromDate && !toDate
              ? tableData?.creationTimestamp
                  ?.toString()
                  .includes(dayjs(fromDate).format("YYYY-MM-DD"))
              : tableData;
          })
          .filter((tableData) => {
            if (fromDate && toDate) {
              const currentDate = dayjs(
                tableData?.creationTimestamp?.toString()
              ).format("YYYY-MM-DD");
              return dayjs(currentDate).isBetween(
                dayjs(fromDate).format("YYYY-MM-DD"),
                dayjs(toDate).format("YYYY-MM-DD")
              );
            } else {
              return tableData;
            }
          })
      : [];
  }, [data, searchParams]);

  const savefilterData = useCallback(
    (res) => {
      setFilterData(res);
    },
    [setFilterData]
  );

  useEffect(() => {
    const res = filteredData();
    savefilterData(res);
  }, [searchParams, filteredData, savefilterData]);

  const handleOnClear = (event) => {
    event.preventDefault();
    selectInputApplicationRef.current.clearValue();
    selectInputActionRef.current.clearValue();
    setFromDate("");
    setToDate("");
    setSearchParams({});
    setFormValues(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="wrapper mb-3">
        <div className="col-md-2">
          <label htmlFor="logID">Log ID</label>
          <input
            type="text"
            className="form-control inputHeight"
            name="logID"
            id="logID"
            autoComplete="off"
            value={formValues.logID}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="applicationId">Application Id</label>
          <input
            type="text"
            className="form-control inputHeight"
            name="applicationId"
            id="applicationId"
            autoComplete="off"
            value={formValues.applicationId}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="applicationType">Application Type</label>
          <Select
            defaultValue={selectedApplicationOption}
            onChange={setSelectedApplicationOption}
            options={applicationTypes}
            isClearable={isClearable}
            id="applicationType"
            name="applicationType"
            ref={selectInputApplicationRef}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="actionType">Action Type</label>
          <Select
            defaultValue={selectedActionOption}
            onChange={setSelectedActionOption}
            options={actionTypes}
            isClearable={isClearable}
            id="actionType"
            name="actionType"
            ref={selectInputActionRef}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="fromDate">From Date</label>
          <DatePicker
            id="fromDate"
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            className="inputHeight"
            name="fromDate"
            autoComplete="off"
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="toDate">To Date</label>
          <DatePicker
            id="toDate"
            selected={toDate}
            onChange={(date) => setToDate(date)}
            className="inputHeight"
            name="toDate"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="mb-3 d-flex justify-content-end">
        <button
          type="submit"
          id="submit"
          className="btn btn-lg mr-2 btn-primary inputHeight"
        >
          <i className="fa fa-search"></i> Search
        </button>
        <button
          type="submit"
          id="clear"
          className="btn btn-lg  btn-primary inputHeight"
          onClick={handleOnClear}
        >
          <i className="fa fa-close"></i> Reset
        </button>
      </div>
    </form>
  );
};

export default Filter;
