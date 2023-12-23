import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserWaitingGamePage() {
  const navigate = useNavigate();
  const {
    userId,
    role,
    timeWaited,
    restaurantId,
    inQueue,
    setInQueue,
    socket,
  } = useContext(UserContext);
  const [counter, setCounter] = useState(0);

  const currentTime = () => {
    const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
    const specificDate = new Date(
      new Date(timeWaited).getTime() - malaysiaTimeOffset
    );

    const currentDate = new Date();

    console.log("timeWaited-" + timeWaited);
    console.log("specificDate-" + specificDate);
    console.log("currentDate-" + currentDate);
    const differenceInMilliseconds = currentDate - specificDate;
    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / (1000 * 60)
    );

    return differenceInMinutes;
  };
  useEffect(() => {
    setCounter(currentTime);
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter(currentTime);
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
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
          <label>{counter} Minutes Waited</label>
        </div>
        <div className="inputGroup">
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

export default UserWaitingGamePage;
