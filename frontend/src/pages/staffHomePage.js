import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import NavBar from "../components/navBar";
import { UserNameLocatingController } from "../controller/userNameLocatingController";

function StaffHomePage() {
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    contact,
    setContact,
    role,
    userId,
    restaurantId,
    socket,
    inQueue,
    setInQueue,
  } = useContext(UserContext);
  const [onOff, setOnOff] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      if (resultJson.restaurantStatus === "open") {
        setOnOff(true);
      } else {
        setOnOff(false);
      }
    } else {
      console.log("error");
    }
  };
  const updateRestaurantStatus = async () => {
    const onOffStatus = {
      restaurantId: restaurantId,
      onOffStatus: onOff,
    };
    const updateOnOffStatus = await fetch(
      "http://localhost:8000/staff/updateRestaurantStatus",
      {
        method: "POST",
        body: JSON.stringify(onOffStatus),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateOnOffStatus.json();
    if (!updateOnOffStatus.ok) {
      console.log("Invalid Credentials");
    } else {
      makeToast("success", "Restaurant Status Updated");
      if (socket) {
        socket.emit("staffUpdate", {
          restaurantId: restaurantId,
          actionType: "homePage",
        });
      }
    }
  };

  const checkAllBookings = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getBookings/${restaurantId}`
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
          if (aData.userId === "") {
            return { ...aData, userName: "" };
          } else {
            const userNameValue = await UserNameLocatingController(
              aData.userId
            );
            return { ...aData, userName: userNameValue };
          }
        })
      );
      setAllBookings(bookingJson);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("homePageChange", {
        restaurantId: restaurantId,
        actionType: "admin",
      });
    }
    getRestaurantList();
  }, []);
  useEffect(() => {
    const handleStaffHomePageUpdate = (message) => {
      if (
        message.restaurantId === restaurantId &&
        message.actionType === "admin"
      ) {
        getRestaurantList();
      }
    };

    socket.on("staffHomeUpdate", handleStaffHomePageUpdate);

    return () => {
      socket.off("staffHomeUpdate", handleStaffHomePageUpdate);
    };
  }, []);
  useEffect(() => {
    const handleStaffHomePageUpdate = (message) => {
      if (
        message.restaurantId === restaurantId &&
        message.actionType === "staff"
      ) {
        checkAllBookings();
      }
    };

    socket.on("homePageUpdate", handleStaffHomePageUpdate);

    return () => {
      socket.off("homePageUpdate", handleStaffHomePageUpdate);
    };
  }, []);
  useEffect(() => {
    checkAllBookings();
  }, []);
  return (
    <>
      <div className="common">
        <NavBar></NavBar>
      </div>
      <br />
      <div className="whiteBox">
        <div className="rowdisplay">
          <div className="button-container d-flex gap-2">
            <label
              className="form-check-label"
              style={{ fontSize: "150%", fontWeight: "bold" }}
            >
              Restaurant Open/Closed:{" "}
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                style={{ margin: "10px", marginTop: "13px" }}
                type="checkbox"
                role="switch"
                checked={onOff}
                onChange={(e) => {
                  setOnOff(e.target.checked);
                }}
              />
            </div>
            <button
              className="btn btn-success"
              onClick={() => {
                updateRestaurantStatus();
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="whiteBox">
        <div className="rowdisplay">
          <div>
            <label
              className="form-check-label"
              style={{ fontSize: "150%", fontWeight: "bold" }}
            >
              Pending Seat Bookings Of The Day:{" "}
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
                <th scope="col">Customer</th>
                <th scope="col">Quantity</th>
                <th scope="col">Type</th>
                <th scope="col">Booked Time</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.userName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.status}</td>
                  <td>{item.BookedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StaffHomePage;
