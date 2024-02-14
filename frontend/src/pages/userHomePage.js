import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import ChatBot from "../components/chatBot";
import { RestaurantNameLocatingController } from "../controller/restaurantNameLocatingController";
function UserHomePage() {
  const navigate = useNavigate();
  const { socket, inQueue, setInQueue, role, userId, restaurantId } =
    useContext(UserContext);
  const [allBookings, setAllBookings] = useState([]);
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
    checkAllBookings();
  }, []);

  const checkAllBookings = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getAllCustomerBookings/${userId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });
    if (response.ok) {
      const bookingJson = await Promise.all(
        json.map(async (aData) => {
          const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
          const dateBooked = new Date(aData.BookedTime);
          const malaysiaBookedDate = new Date(
            dateBooked.getTime() - malaysiaTimeOffset
          );

          const options = {
            timeZone: "Asia/Kuala_Lumpur", // Set the desired time zone
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          };
          const readableDateString = malaysiaBookedDate.toLocaleString(
            "en-US",
            options
          );
          aData.BookedTime = readableDateString;
          if (aData.restaurantId === "") {
            return { ...aData, restaurantName: "" };
          } else {
            const restaurantNameValue = await RestaurantNameLocatingController(
              aData.restaurantId
            );
            return { ...aData, restaurantName: restaurantNameValue };
          }
        })
      );
      setAllBookings(bookingJson);
    }
  };
  return (
    <div className="common">
      <NavBar></NavBar>
      <br />
      <br />
      <div className="whiteBox">
        <div className="rowdisplay" style={{ textAlign: "center" }}>
          <div>
            <label
              className="form-check-label"
              style={{ fontSize: "150%", fontWeight: "bold" }}
            >
              Restaurant Booking Status:{" "}
            </label>
            <br />
            <label className="form-check-label">
              Please Make Sure To Enter "Wait For Booking" 10 Minutes Before The
              Actual Time
            </label>
          </div>
        </div>
      </div>
      <div className="whiteBox">
        {" "}
        <div className="container mt-4 mb-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Restaurant Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Booked Time</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.restaurantName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.BookedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {inQueue && <ChatBot></ChatBot>}
    </div>
  );
}

export default UserHomePage;
