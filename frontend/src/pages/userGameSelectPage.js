import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserGameSelectPage() {
  const navigate = useNavigate();
  const {
    waitingPoints,
    setWaitingPoints,
    chosenGame,
    setChosenGame,
    socket,
    userId,
    restaurantId,
    inQueue,
    setInQueue,
    role,
  } = useContext(UserContext);
  useEffect(() => {
    setWaitingPoints(0);
  }, []);
  useEffect(() => {
    socket.on("getSeat", (message) => {
      if (message.userId === userId && role === "user") {
        if (message.restaurantId === restaurantId) {
          if (inQueue) {
            setInQueue(false);
            navigate(`/user/seatPage/${message.tableName}`);
          }
        }
      }
    });
  }, []);
  return (
    <div className="card">
      <div className="cardHeader">Games</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label>-The Waiting Game-</label>
          <label>Simply Wait To Earn Points As Time Passes</label>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/user/customerWaitingGame");
            }}
          >
            Play The Waiting Game
          </button>
        </div>
        <div className="inputGroup">
          <label>-The Action Game-</label>
          <label>Play Action Games To Win Points</label>
          <button
            className="btn btn-warning"
            onClick={() => {
              setChosenGame("action");
              navigate("/home");
            }}
          >
            Play The Action Game
          </button>
        </div>
        <div>
          <label>The Waiting Game Will Be Selected By Default</label>
        </div>
        <div>
          <button
            className="btn btn-warning"
            onClick={() => {
              navigate("/user/home");
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserGameSelectPage;
