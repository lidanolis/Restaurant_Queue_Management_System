import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function StaffWaitingTimePage() {
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
  const [waitingTimeRequired, setWaitingTimeRequired] = useState(0);
  const waitingTimeTypeRef = useRef("minute");

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      setWaitingTimeRequired(resultJson.estimatedWaitTime);
      waitingTimeTypeRef.current.value = resultJson.estimatedWaitTimeFormat;
    } else {
      console.log("error");
    }
  };
  const updateRestaurantWaitingTIme = async () => {
    const waitingTime = {
      estimatedWaitTime: waitingTimeRequired,
      estimatedWaitTimeFormat: waitingTimeTypeRef.current.value,
    };
    const updateWaitingTime = await fetch(
      `http://localhost:8000/staff/updateRestaurantWaitingTime/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(waitingTime),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateWaitingTime.json();
    if (updateWaitingTime.ok) {
      makeToast("success", "Wait Time Updated");
    }
  };
  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };
  useEffect(() => {
    getRestaurantList();
  }, []);
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Waiting Time</div>
        <div className="cardBody">
          <label>Waiting Time To Show To The Customers</label>
          <div className="container">
            <div className="row">
              <div class="col-md-6">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="waitingTimeRequired"
                    onChange={(e) => {
                      setWaitingTimeRequired(e.target.value);
                    }}
                    value={waitingTimeRequired}
                  ></input>
                </div>
              </div>
              <div class="col-md-6">
                <div className="input-group mb-3">
                  <select
                    name="waitingTimeTypeRef"
                    defaultValue={waitingTimeTypeRef.current.value}
                    ref={waitingTimeTypeRef}
                    className="form-select"
                  >
                    <option value="second">second</option>
                    <option value="minute">minute</option>
                    <option value="hour">hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="button-container d-flex gap-2">
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/staff/home");
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (isValidNumericInput(waitingTimeRequired)) {
                  updateRestaurantWaitingTIme();
                } else {
                  makeToast("error", "Invalid Waiting Time");
                }
              }}
              className="btnBasicDesign"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffWaitingTimePage;
