import React, { useState, useContext, useEffect } from "react";
import makeToast from "../toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
function UserQueueChangePage() {
  const navigate = useNavigate();
  const {
    userId,
    restaurantId,
    socket,
    setSocket,
    inQueue,
    setInQueue,
    book,
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

  const getBooking = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getBooking/${book}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const foundBook = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      setTableQuantity(foundBook.quantity);
    }
  };

  const updateBooking = async () => {
    const newBooking = {
      newTableQuantity: tableQuantity,
    };
    const createNewBooking = await fetch(
      `http://localhost:8000/user/updateBookingQuantity/${book}`,
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
      console.log("Booking Updated");
      makeToast("success", "Booking Information Updated");
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
    getBooking();
  }, []);

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Booking Modification</div>
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
            <button
              onClick={() => {
                if (isValidNumericInput(tableQuantity)) {
                  updateBooking();
                } else {
                  makeToast("error", "Invalid Table Quantity");
                }
              }}
              className="btnBasicDesignYellow"
            >
              Update Information
            </button>
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/user/home");
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

export default UserQueueChangePage;
