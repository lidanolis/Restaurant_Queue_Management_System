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

  const manageQueue = async () => {
    if (isValidNumericInput(tableQuantity)) {
      joinQueue()
        .then(() => {
          makeToast("success", "Table Booked");
          checkStaffRoom();
          navigate("/user/customerGameSelectPage");
        })
        .catch((err) => {
          makeToast("error", err);
        });
    } else {
      makeToast("error", "Invalid Number");
    }
  };

  useEffect(() => {
    socket.on("getSeat", (message) => {
      console.log("received the getSeat message");
      console.log("userId from message:" + message.userId);
      console.log("userId:" + userId);
      console.log("restaurantId from message:" + message.restaurantId);
      console.log("restaurantId:" + restaurantId);
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

  useEffect(() => {
    socket.on("RoomStatusResult", (message) => {
      if (message.userId === userId) {
        if (
          message.message === "available" &&
          message.actionType === "queueCheck"
        ) {
          assignSeat();
        }
      }
    });
  }, []);

  return (
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
          <button onClick={manageQueue} className="btn btn-warning">
            Enter Queue
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              navigate(`/user/restaurant/${restaurantId}`);
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserQueueInfoPage;
