import React, { useState, useContext, useEffect } from "react";
import makeToast from "../toast";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function UserSeatBookingPage() {
  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
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
  const [selectedDate, setSelectedDate] = useState(null);
  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };

  const createBooking = async () => {
    const newBooking = {
      userId,
      restaurantId,
      quantity: tableQuantity,
      status: "Book",
      tableName: "",
      BookedTime: selectedDate,
    };
    console.log("new Booking-" + JSON.stringify(newBooking));
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
    }
  };

  const manageQueue = async () => {
    if (isValidNumericInput(tableQuantity)) {
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

      const rightNow = new Date();

      if (!onOffStats) {
        rightNow.setDate(rightNow.getDate() + 1);
        rightNow.setHours(0, 0, 0, 0);
      }

      if (selectedDate >= rightNow) {
        createBooking()
          .then(() => {
            makeToast("success", "Table Booked");
            if (socket) {
              socket.emit("homePageChange", {
                restaurantId: restaurantId,
                actionType: "staff",
              });
            }
            navigate(`/user/restaurant/${restaurantId}`);
          })
          .catch((err) => {
            makeToast("error", err);
          });
      } else {
        if (onOffStats) {
          makeToast("error", "Chosen Date And Time Has Already Pass");
        } else {
          makeToast("error", "The Restaurant Is Closed For The Day.");
        }
      }
    } else {
      makeToast("error", "Invalid Number");
    }
  };

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Seat Booking</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>Booking Time</label>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
                dateFormat="dd/MM/yyyy hh:mm a"
                minDate={minDate}
                showTimeSelect={true}
                timeIntervals={15}
                timeFormat="hh:mm a"
              ></DatePicker>
            </div>
          </div>
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
            <button onClick={manageQueue} className="btnBasicDesignYellow">
              Book Table
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

export default UserSeatBookingPage;
