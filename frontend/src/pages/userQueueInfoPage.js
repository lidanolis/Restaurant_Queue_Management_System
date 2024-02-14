import React, { useState, useContext, useEffect } from "react";
import makeToast from "../toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
function UserQueueInfoPage() {
  const navigate = useNavigate();
  const {
    userId,
    restaurantId,
    socket,
    setSocket,
    inQueue,
    setInQueue,
    Book,
    setBook,
    role,
    setTimeWaited,
    setRestaurantChatbotMessage,
  } = useContext(UserContext);
  const [tableQuantity, setTableQuantity] = useState(0);

  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };

  const assignSeat = async () => {
    await QueueManagementController(restaurantId, socket, 1);
  };

  const checkStaffRoom = () => {
    if (socket) {
      socket.emit("checkRoom", {
        restaurantId: restaurantId + "staff",
        userId: userId,
        actionType: "queueCheck",
      });
    }
  };

  const joinQueue = async () => {
    if (socket) {
      socket.emit("joinRoom", { restaurantId });
      setInQueue(true);
    }
    const newBooking = {
      userId,
      restaurantId,
      quantity: tableQuantity,
      status: "Pending",
      tableName: "",
      BookedTime: new Date(),
    };
    const createNewBooking = await fetch(
      "http://localhost:8000/user/bookTable",
      {
        method: "POST",
        body: JSON.stringify(newBooking),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await createNewBooking.json();
    if (!createNewBooking.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log("Booked Table");
      setBook(json._id);
      console.log("booked Time recorded-" + json.BookedTime);
      setTimeWaited(json.BookedTime);
    }
  };

  const getRestaurantData = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getARestaurant/${restaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
      makeToast("error", "Invalid");
      navigate("/user/join");
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
      makeToast("error", "Invalid");
      navigate("/user/join");
    });

    if (response.ok) {
      setRestaurantChatbotMessage(json.chatbotSequence);
    } else {
      makeToast("error", "Invalid");
      navigate("/user/join");
    }
  };

  const manageQueue = async () => {
    var onOffStats = false;
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      if (resultJson.restaurantStatus === "open") {
        onOffStats = true;
      } else {
        onOffStats = false;
      }
    } else {
      console.log("error");
      onOffStats = false;
    }

    if (isValidNumericInput(tableQuantity)) {
      if (onOffStats) {
        joinQueue()
          .then(() => {
            makeToast("success", "Table Booked");
            getRestaurantData().then(() => {
              checkStaffRoom();
              navigate("/user/customerGameSelectPage");
            });
          })
          .catch((err) => {
            makeToast("error", err);
          });
      } else {
        makeToast(
          "warning",
          "Restaurant Is Already Closed, Please Try Again Later"
        );
      }
    } else {
      makeToast("error", "Invalid Number");
    }
  };

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

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Queue Registration</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label htmlFor="tableQuantity">Seat Required</label>
            <input
              type="text"
              name="tableQuantity"
              id="tableQuantity"
              onChange={(e) => {
                setTableQuantity(e.target.value);
              }}
              value={tableQuantity}
            ></input>
          </div>

          <div className="button-container d-flex gap-2">
            <button onClick={manageQueue} className="btnBasicDesignOrange">
              Enter Queue
            </button>
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate(`/user/restaurant/${restaurantId}`);
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

export default UserQueueInfoPage;
