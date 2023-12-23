import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function AdminGameSetupPage() {
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
  const [waitingGameTimeRequired, setWaitingGameTimeRequired] = useState(0);
  const waitingGameTimeTypeRef = useRef("minute");
  const [waitingGamePointsGiven, setWaitingGamePointsGiven] = useState(0);
  const [actionGamePointsGiven, setActionGamePointsGiven] = useState(0);

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      setWaitingGameTimeRequired(resultJson.waitingGameTimeRequired);
      waitingGameTimeTypeRef.current.value = resultJson.waitingGameTimeType;
      setWaitingGamePointsGiven(resultJson.waitingGamePointsGiven);
      setActionGamePointsGiven(resultJson.actionGamePointsGiven);
    } else {
      console.log("error");
    }
  };
  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };
  const updateGameSetup = async () => {
    const newGameSetup = {
      actionGamePointsGiven: actionGamePointsGiven,
      waitingGameTimeRequired: waitingGameTimeRequired,
      waitingGameTimeType: waitingGameTimeTypeRef.current.value,
      waitingGamePointsGiven: waitingGamePointsGiven,
    };
    const updateNewGameSetup = await fetch(
      `http://localhost:8000/staff/updateGame/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(newGameSetup),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewGameSetup.json();
    if (!updateNewGameSetup.ok) {
      console.log("Invalid Credentials");
    } else {
      makeToast("success", "Game Setup Updated");
    }
  };
  const quitQueue = () => {
    if (socket) {
      const adminRoomID = restaurantId + "admin";
      socket.emit("leaveRoom", { restaurantId: adminRoomID });
    }
  };
  useEffect(() => {
    getRestaurantList();
  }, []);
  return (
    <div className="card">
      <div className="cardHeader">Game Setup</div>
      <div className="cardBody">
        <label>Waiting Game Time Required To Earn Points</label>
        <div className="container">
          <div className="row">
            <div class="col-md-6">
              <div className="input-group mb-3">
                <input
                  type="text"
                  name="waitingGameTimeRequired"
                  onChange={(e) => {
                    setWaitingGameTimeRequired(e.target.value);
                  }}
                  value={waitingGameTimeRequired}
                ></input>
              </div>
            </div>
            <div class="col-md-6">
              <div className="input-group mb-3">
                <select
                  name="waitingGameTimeTypeRef"
                  defaultValue={waitingGameTimeTypeRef.current.value}
                  ref={waitingGameTimeTypeRef}
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
        <div className="inputGroup">
          <label>Waiting Game Points Given</label>
          <input
            type="text"
            name="waitingGamePointsGiven"
            onChange={(e) => {
              setWaitingGamePointsGiven(e.target.value);
            }}
            value={waitingGamePointsGiven}
          ></input>
        </div>
        <div className="inputGroup">
          <label>Action Game Points Given</label>
          <input
            type="text"
            name="actionGamePointsGiven"
            onChange={(e) => {
              setActionGamePointsGiven(e.target.value);
            }}
            value={actionGamePointsGiven}
          ></input>
        </div>
        <div className="button-container d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              quitQueue();
              navigate("/admin/home");
            }}
          >
            Back
          </button>
          <button
            onClick={() => {
              if (
                isValidNumericInput(waitingGameTimeRequired) &&
                isValidNumericInput(waitingGamePointsGiven) &&
                isValidNumericInput(actionGamePointsGiven)
              ) {
                updateGameSetup();
              } else {
                if (!isValidNumericInput(waitingGameTimeRequired))
                  setWaitingGameTimeRequired(0);
                if (!isValidNumericInput(waitingGamePointsGiven))
                  setWaitingGamePointsGiven(0);
                if (!isValidNumericInput(actionGamePointsGiven))
                  setActionGamePointsGiven(0);
                makeToast("error", "Invalid Values");
              }
            }}
            className="btn btn-warning"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminGameSetupPage;
