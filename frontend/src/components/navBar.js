import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function NavBar() {
  const navigate = useNavigate();
  const { role, inQueue, setInQueue, socket, restaurantId, book, setBook } =
    useContext(UserContext);
  console.log(`navBar Role ${role}`);

  const exitQueue = async () => {
    var userId;
    var restaurantId;
    var quantity;
    var status;
    var tableName;
    var BookedTime;
    console.log("booking_Id " + book);
    const response = await fetch(
      `http://localhost:8000/user/getBooking/${book}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const foundBook = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      userId = foundBook.userId;
      restaurantId = foundBook.restaurantId;
      quantity = foundBook.quantity;
      status = "Cancelled";
      tableName = foundBook.tableName;
      BookedTime = foundBook.BookedTime;
    }
    console.log("userId " + foundBook.userId);
    console.log("restaurantId " + foundBook.restaurantId);
    console.log("quantity " + foundBook.quantity);
    console.log("status " + status);
    console.log("tableName " + foundBook.tableName);
    console.log("BookedTime " + foundBook.BookedTime);

    const newBooking = {
      userId: userId,
      restaurantId: restaurantId,
      quantity: quantity,
      status: status,
      tableName: tableName,
      BookedTime: BookedTime,
    };
    const updateNewBooking = await fetch(
      `http://localhost:8000/user/updateTable/${book}`,
      {
        method: "POST",
        body: JSON.stringify(newBooking),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewBooking.json();
    if (!updateNewBooking.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log("Booking Updated");
      setBook(json._id);
    }
  };

  const quitQueue = async () => {
    if (socket) {
      socket.emit("leaveRoom", { restaurantId });
      setInQueue(false);
      exitQueue();
    }
  };
  return (
    <nav
      style={{ backgroundColor: "rgba(255, 193, 7, 1)" }}
      className="navbar navbar-expand-lg navbar-light"
    >
      <a
        style={{ cursor: "default", fontWeight: "bold" }}
        className="navbar-brand mx-2"
      >
        {role.toUpperCase()}
      </a>

      <button
        className="navbar-toggler mx-2"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon mx-2"></span>
      </button>

      <div
        style={{ cursor: "pointer" }}
        className="collapse navbar-collapse mx-2"
        id="navbarNavAltMarkup"
      >
        {role === "staff" && (
          <div className="navbar-nav">
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link active mx-2"
              onClick={() => navigate("/staff/home")}
            >
              Home <span className="sr-only">(current)</span>
            </a>
            <a style={{ cursor: "pointer" }} className="nav-item nav-link mx-2">
              View Table
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </a>
          </div>
        )}

        {role === "admin" && (
          <div className="navbar-nav">
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link active mx-2"
              onClick={() => navigate("/admin/home")}
            >
              Home <span className="sr-only">(current)</span>
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/staff/register")}
            >
              Register New User
            </a>
            <a style={{ cursor: "pointer" }} className="nav-item nav-link mx-2">
              View Chatbot
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/admin/viewTable")}
            >
              View Table
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </a>
          </div>
        )}

        {role === "user" && (
          <div className="navbar-nav">
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link active mx-2"
              onClick={() => navigate("/user/home")}
            >
              Home <span className="sr-only">(current)</span>
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </a>
            {!inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => navigate("/user/join")}
              >
                Join Restaurant
              </a>
            )}
            {inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => navigate("/user/join")}
              >
                View Status
              </a>
            )}
            {inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => navigate("/user/join")}
              >
                Earn Rewards
              </a>
            )}
            {inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => {
                  quitQueue().then(() => {
                    makeToast("success", "Quit From Queue");
                  });
                }}
              >
                Quit Queue
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
