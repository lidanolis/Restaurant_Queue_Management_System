import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function StaffSeatUserChangePage() {
  const pageParams = useParams();
  const tableName = pageParams.tableName;
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    contact,
    setContact,
    role,
    userId,
    restaurantId,
    socket,
    inQueue,
    setInQueue,
  } = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const [holdTableName, setHoldTableName] = useState(tableName);
  const tableNameRef = useRef("");

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      setTableList(resultJson.restaurantTable);
    } else {
      console.log("error");
    }
  };

  const updateTableList = async () => {
    const findObject = tableList.find((obj) => obj.tableName === holdTableName);
    const findEmptyObject = tableList.find(
      (obj) => obj.tableName === tableName
    );
    console.log("current Table-" + holdTableName);
    console.log("findObject-" + JSON.stringify(findObject));
    const newTableObject = {
      tableName: holdTableName,
      tableQuantity: findObject.tableQuantity,
      tableStatus: "occupied",
      userId: findEmptyObject.userId,
    };

    const manageRestaurantTables = await fetch(
      `http://localhost:8000/staff/updateTable/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(newTableObject),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await manageRestaurantTables.json();
    if (!manageRestaurantTables.ok) {
      console.log("Invalid Credentials");
    } else {
      const emptyTableObject = {
        tableName: tableName,
        tableQuantity: findEmptyObject.tableQuantity,
        tableStatus: "available",
        userId: null,
      };
      const manageEmptyRestaurantTables = await fetch(
        `http://localhost:8000/staff/updateTable/${restaurantId}`,
        {
          method: "POST",
          body: JSON.stringify(emptyTableObject),
          headers: { "Content-Type": "application/json" },
        }
      );
      const jsonResult = await manageEmptyRestaurantTables.json();
      if (manageEmptyRestaurantTables.ok) {
        makeToast("success", "Seat Changed");
        navigate("/staff/viewTable");
      }
    }
  };

  useEffect(() => {
    getRestaurantList();
  }, []);
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Seat</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>Customer Seat</label>
            <br />
            <select
              name="tableNameRef"
              value={holdTableName}
              onChange={(e) => setHoldTableName(e.target.value)}
              className="form-select"
            >
              {tableList.map(
                (aTable) =>
                  (aTable.tableStatus === "available" ||
                    aTable.tableName === tableName) && (
                    <option key={aTable.tableName} value={aTable.tableName}>
                      {aTable.tableName}
                    </option>
                  )
              )}
            </select>
          </div>

          <div className="button-container d-flex gap-2">
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/staff/viewTable");
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (holdTableName === tableName) {
                  makeToast("error", "No Changes Made");
                } else {
                  updateTableList();
                }
              }}
              className="btnBasicDesignYellow"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffSeatUserChangePage;
