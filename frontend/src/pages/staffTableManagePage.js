import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";

function StaffTableManagePage({ managementFunction }) {
  const pageParams = useParams();
  const TableId = pageParams.id;
  const { restaurantId, socket } = useContext(UserContext);
  const navigate = useNavigate();
  const [tableName, setTableName] = useState("");
  const [tableQuantity, setTableQuantity] = useState("");
  const [tableUserId, settableUserId] = useState("");
  const tableStatusRef = useRef("available");
  var duplivalue = undefined;

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      const foundItem = resultJson.restaurantTable.find(
        (item) => item.tableName === tableName
      );
      duplivalue = foundItem;
    } else {
      console.log("error");
      duplivalue = undefined;
    }
  };

  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };
  const manageTable = async () => {
    if (tableName.length === 0 || tableQuantity.length === 0) {
      makeToast("error", "Please Input All Required Credentials");
    } else if (tableName === "0") {
      makeToast("error", "Invalid Table Name");
    } else if (!isValidNumericInput(tableQuantity)) {
      makeToast("error", "Invalid Table Quantity");
    } else {
      getRestaurantList().then(async () => {
        console.log("list size: " + duplivalue);
        if (managementFunction === "add" && duplivalue !== undefined) {
          makeToast(
            "error",
            "Table Name Already Exist, Please Use Another Name"
          );
        } else {
          const newTableObject = {
            tableName,
            tableQuantity,
            tableStatus: tableStatusRef.current.value,
            userId: tableUserId,
          };

          if (
            managementFunction !== "add" &&
            newTableObject.tableStatus === "available"
          ) {
            newTableObject.userId = null;
          }

          console.log("newtableObject here:" + JSON.stringify(newTableObject));
          const manageRestaurantTableUrl =
            managementFunction === "add"
              ? `http://localhost:8000/staff/addTable/${restaurantId}`
              : `http://localhost:8000/staff/updateTable/${restaurantId}`;
          const manageRestaurantTables = await fetch(manageRestaurantTableUrl, {
            method: "POST",
            body: JSON.stringify(newTableObject),
            headers: { "Content-Type": "application/json" },
          });
          const json = await manageRestaurantTables.json();
          if (!manageRestaurantTables.ok) {
            console.log("Invalid Credentials");
          } else {
            console.log(`Restaurant Tables Updated`);
            makeToast("success", `Successful ${managementFunction} action`);
            navigate("/staff/viewTable");
          }
        }
      });
    }
  };

  const modifyTable = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      const tableList = resultJson.restaurantTable;
      tableList.map((item, index) => {
        if (item.tableName == TableId) {
          setTableName(item.tableName);
          setTableQuantity(item.tableQuantity);
          settableUserId(item.userId);
          tableStatusRef.current.value = item.tableStatus;
        }
      });
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    console.log("managementFunction:" + managementFunction);
    modifyTable();
  }, []);
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Table</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label htmlFor="tableName">table Name</label>
            <input
              type="text"
              name="tableName"
              id="tableName"
              onChange={(e) => {
                setTableName(e.target.value);
              }}
              value={tableName}
              readOnly
            ></input>
          </div>
          <div className="inputGroup">
            <label htmlFor="tableQuantity">table Quantity</label>
            <input
              type="text"
              name="tableQuantity"
              id="tableQuantity"
              onChange={(e) => {
                setTableQuantity(e.target.value);
              }}
              value={tableQuantity}
              readOnly
            ></input>
          </div>
          <div className="inputGroup">
            <label htmlFor="tableStatus">Table Availability</label>
            <select
              name="tableStatus"
              id="tableStatus"
              defaultValue={tableStatusRef.current.value}
              ref={tableStatusRef}
              className="form-select"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="button-container d-flex gap-2">
            <button onClick={manageTable} className="btnBasicDesignOrange">
              {managementFunction}
            </button>
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/staff/viewTable");
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffTableManagePage;
