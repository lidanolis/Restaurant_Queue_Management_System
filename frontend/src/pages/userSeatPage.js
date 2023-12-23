import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
function UserSeatPage() {
  const navigate = useNavigate();
  const {
    socket,
    setInQueue,
    userId,
    restaurantId,
    timeWaited,
    chosenGame,
    waitingPoints,
  } = useContext(UserContext);
  const [counter, setCounter] = useState(0);
  const [newPoints, setNewPoints] = useState(0);
  const [waitingGameTimeType, setWaitingGameTimeType] = useState("");
  var waitingGameTimeRequired = 0;
  var waitingGameTimeTypeRef;
  var waitingGamePointsGiven = 0;
  var actionGamePointsGiven = 0;

  const currentTime = (timeType) => {
    console.log("timeType-" + timeType);
    var timeTypeConversion;
    if (timeType === "second") {
      timeTypeConversion = 1000;
    } else if (timeType === "minute") {
      timeTypeConversion = 1000 * 60;
    } else {
      timeTypeConversion = 1000 * 60 * 60;
    }
    const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
    const specificDate = new Date(
      new Date(timeWaited).getTime() - malaysiaTimeOffset
    );

    const currentDate = new Date();

    console.log("timeWaited-" + timeWaited);
    console.log("specificDate-" + specificDate);
    console.log("currentDate-" + currentDate);
    const differenceInMilliseconds = currentDate - specificDate;
    const differenceInTime = Math.floor(
      differenceInMilliseconds / timeTypeConversion
    );

    if (Number.isNaN(differenceInTime)) {
      return 0;
    }

    return differenceInTime;
  };

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      console.log(
        "waitingGameTimeRequired-" + resultJson.waitingGameTimeRequired
      );
      console.log(
        "waitingGamePointsGiven-" + resultJson.waitingGamePointsGiven
      );
      console.log("waitingGameTimeTypeRef-" + resultJson.waitingGameTimeType);
      waitingGameTimeRequired = resultJson.waitingGameTimeRequired;
      waitingGameTimeTypeRef = resultJson.waitingGameTimeType;
      waitingGamePointsGiven = resultJson.waitingGamePointsGiven;
      actionGamePointsGiven = resultJson.actionGamePointsGiven;
    } else {
      console.log("error");
    }
  };

  const addPointsToCustomer = async (newPoints) => {
    console.log("newPoints-" + newPoints);
    const newPoint = { userId, restaurantId, userPoints: newPoints };
    const updateCustomerPoint = await fetch(
      "http://localhost:8000/user/updateCustomerPoints",
      {
        method: "POST",
        body: JSON.stringify(newPoint),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateCustomerPoint.json();
    if (updateCustomerPoint.ok) {
      makeToast("success", "Points Added For You");
    }
  };

  useEffect(() => {
    getRestaurantList().then(() => {
      if (chosenGame === "wait") {
        var timeTallied = currentTime(waitingGameTimeTypeRef);
        setCounter(timeTallied);
        console.log("timeTallied-" + timeTallied);
        console.log("waitingGameTimeRequired-" + waitingGameTimeRequired);
        console.log("waitingGamePointsGiven-" + waitingGamePointsGiven);
        var newPointsTallied = 0;
        if (timeTallied > 0) {
          newPointsTallied =
            (timeTallied / waitingGameTimeRequired) * waitingGamePointsGiven;
        }

        setNewPoints(parseInt(newPointsTallied, 10));
        setWaitingGameTimeType(waitingGameTimeTypeRef);
        addPointsToCustomer(parseInt(newPointsTallied, 10));
      } else {
        setCounter(currentTime("minute"));
      }
    });
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit("leaveRoom", { restaurantId });
      setInQueue(false);
    }
  }, []);
  const pageParams = useParams();
  const tableName = pageParams.tableName;
  return (
    <div>
      <div>Thank You For Waiting, Please Proceed To Table {tableName}</div>
      <div>
        You Have Waited For A Total Of {counter} {waitingGameTimeType}
      </div>
      <div>You Earned A Total Of {newPoints} Points</div>
      <button
        className="btn btn-warning"
        onClick={() => {
          navigate("/user/home");
        }}
      >
        Home
      </button>
    </div>
  );
}

export default UserSeatPage;
