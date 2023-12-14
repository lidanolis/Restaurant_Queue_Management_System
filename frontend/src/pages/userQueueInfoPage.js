import React, { useState, useContext, useEffect } from "react";
import makeToast from "../toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

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
  } = useContext(UserContext);
  const [tableQuantity, setTableQuantity] = useState(0);

  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
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
    }
  };

  const manageQueue = async () => {
    if (isValidNumericInput(tableQuantity)) {
      joinQueue()
        .then(() => {
          makeToast("success", "Table Booked");
          navigate("/user/home");
        })
        .catch((err) => {
          makeToast("error", err);
        });
    } else {
      makeToast("error", "Invalid Number");
    }
  };

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
