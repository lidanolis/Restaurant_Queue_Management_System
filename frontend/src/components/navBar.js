import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function NavBar({ currentPage }) {
  const navigate = useNavigate();
  const {
    role,
    inQueue,
    setInQueue,
    socket,
    restaurantId,
    book,
    setBook,
    userId,
    chosenGame,
  } = useContext(UserContext);
  console.log(`navBar Role ${role}`);

  useEffect(() => {
    socket.on("RoomStatusResult", (message) => {
      if (message.userId === userId && role === "admin") {
        if (message.message === "available") {
          if (message.actionType === "chatbot") {
            joinAdminRoom();
            navigate("/admin/chatbot");
          } else if (message.actionType === "table") {
            joinAdminRoom();
            navigate("/admin/viewTable");
          } else if (message.actionType === "game") {
            joinAdminRoom();
            navigate("/admin/gameSetup");
          }
        } else {
          if (message.actionType === "chatbot") {
            makeToast(
              "warning",
              "Cannot Access Chatbot When System is Serving"
            );
          } else {
            makeToast("warning", message.message);
          }
        }
      }
    });
  }, []);

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

  const checkRoom = (actionT) => {
    console.log("triggered this effect");
    if (socket) {
      socket.emit("checkRoom", {
        restaurantId: restaurantId,
        userId: userId,
        actionType: actionT,
      });
    }
  };
  const joinAdminRoom = () => {
    const adminRoomId = restaurantId + "admin";
    console.log("adminRoomId " + adminRoomId);
    if (socket) {
      socket.emit("joinRoom", { restaurantId: adminRoomId });
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
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => {
                navigate("/staff/viewTable");
              }}
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
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/")}
            >
              Log Out
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
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => {
                checkRoom("chatbot");
              }}
            >
              View Chatbot
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => {
                checkRoom("table");
              }}
            >
              View Table
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => {
                navigate("/admin/voucher");
              }}
            >
              View Voucher
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => {
                checkRoom("game");
              }}
            >
              Games Setup
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/")}
            >
              Log Out
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
                Restaurants
              </a>
            )}
            {!inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => navigate("/")}
              >
                Log Out
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
                onClick={() => {
                  if (chosenGame === "wait") {
                    navigate("/user/customerWaitingGame");
                  } else {
                    navigate("/user/home");
                  }
                }}
              >
                Return To Game
              </a>
            )}
            {inQueue && (
              <a
                style={{ cursor: "pointer" }}
                className="nav-item nav-link mx-2"
                onClick={() => navigate("/user/voucherPage/" + restaurantId)}
              >
                View Vouchers
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
