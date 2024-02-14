import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
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
    setChosenGame("wait");
  }, []);

  const assignSeat = async () => {
    await QueueManagementController(restaurantId, socket, 1);
  };

  useEffect(() => {
    const handleRoomStatusResult = (message) => {
      if (message.userId === userId) {
        if (
          message.message === "available" &&
          message.actionType === "queueCheck"
        ) {
          console.log("assigning seat");
          assignSeat();
        }
      }
    };

    socket.on("RoomStatusResult", handleRoomStatusResult);

    return () => {
      socket.off("RoomStatusResult", handleRoomStatusResult);
    };
  }, []);

  useEffect(() => {
    const handleGetSeat = (message) => {
      if (message.userId === userId && role === "user") {
        if (message.restaurantId === restaurantId) {
          if (inQueue) {
            setInQueue(false);
            navigate(`/user/seatPage/${message.tableName}`);
          }
        }
      }
    };

    socket.on("getSeat", handleGetSeat);

    return () => {
      socket.off("getSeat", handleGetSeat);
    };
  }, []);
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Games</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>-The Waiting Game-</label>
            <label>Simply Wait To Earn Points As Time Passes</label>
            <button
              className="btnBasicDesignYellow"
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
              className="btnBasicDesignOrange"
              onClick={() => {
                setChosenGame("action");
                navigate("/user/customerActionGame");
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
              className="btnBasicDesign"
              onClick={() => {
                navigate("/user/home");
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserGameSelectPage;
