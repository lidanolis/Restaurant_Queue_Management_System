import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";
import "./NavBar.css";

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
    const handleRoomStatusResult = (message) => {
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
          } else if (message.actionType === "menu") {
            joinAdminRoom();
            navigate("/admin/restaurantMenu");
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
    };

    socket.on("RoomStatusResult", handleRoomStatusResult);

    return () => {
      socket.off("RoomStatusResult", handleRoomStatusResult);
    };
  }, []);

  const inOutStatus = async () => {
    const inoutStatus = {
      inOut: "out",
    };
    const updateInOutStatus = await fetch(
      `http://localhost:8000/updateInOut/${userId}`,
      {
        method: "POST",
        body: JSON.stringify(inoutStatus),
        headers: { "Content-Type": "application/json" },
      }
    );
    const inOutJson = await updateInOutStatus.json();
    if (updateInOutStatus.ok) {
      if (socket) {
        socket.emit("homePageChange", {
          restaurantId: restaurantId,
          actionType: "admin",
        });
      }
      navigate("/");
    }
  };

  const checkSeating = async () => {
    const response = await fetch(
      `http://localhost:8000/user/checkRestaurantSeats/${userId}`
    );
    const foundSeat = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      const findObject = foundSeat.restaurantTable.find(
        (aTable) => aTable.userId === userId
      );
      navigate(`/user/seatBookFound/${findObject.tableName}`);
    } else {
      makeToast("error", "No Seat Found");
    }
  };

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
      exitQueue().then(() => {
        if (socket) {
          socket.emit("homePageChange", {
            restaurantId: restaurantId,
            actionType: "staff",
          });
        }
      });
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
    <div className="nav">
      {" "}
      <ul>
        <li>
          <div className="Logo">{role.toUpperCase()}</div>
        </li>
        {role === "staff" && (
          <>
            <li>
              {" "}
              <div className="Home">Home (Current)</div>
            </li>
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/staff/viewTable");
                }}
              >
                Table Setup
              </a>
            </li>
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/staff/estimationWaitingTime");
                }}
              >
                Estimation Waiting Time
              </a>
            </li>
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/admin/QRcode");
                }}
              >
                QR Code Setup
              </a>
            </li>
            <li>
              <a style={{ cursor: "default", fontWeight: "bold" }}>Setting</a>
              <ul>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a style={{ cursor: "pointer" }} onClick={inOutStatus}>
                    Log Out
                  </a>
                </li>
              </ul>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li>
              {" "}
              <div className="Home">Home (Current)</div>
            </li>
            <li>
              <a style={{ cursor: "default", fontWeight: "bold" }}>
                Restaurant Setup
              </a>
              <ul>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      checkRoom("chatbot");
                    }}
                  >
                    Chatbot Setup
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      checkRoom("table");
                    }}
                  >
                    Table Setup
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/admin/voucher");
                    }}
                  >
                    Voucher Setup
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      checkRoom("game");
                    }}
                  >
                    Games Setup
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      checkRoom("menu");
                    }}
                  >
                    Menu Setup
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/staff/register")}
              >
                Account Registration
              </a>
            </li>
            <li>
              <a style={{ cursor: "default", fontWeight: "bold" }}>Setting</a>
              <ul>
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a style={{ cursor: "pointer" }} onClick={inOutStatus}>
                    Log Out
                  </a>
                </li>
              </ul>
            </li>
          </>
        )}

        {role === "user" && (
          <>
            <li>
              {" "}
              <div className="Home">Home (Current)</div>
            </li>
            {!inQueue && (
              <li>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/user/join")}
                >
                  Restaurants
                </a>
              </li>
            )}

            {!inQueue && (
              <li>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/user/selectingSeatBooking");
                  }}
                >
                  Wait For Booking
                </a>
              </li>
            )}

            {!inQueue && (
              <li>
                <a style={{ cursor: "pointer" }} onClick={checkSeating}>
                  Return To Seat
                </a>
              </li>
            )}

            {inQueue && (
              <li>
                <a style={{ cursor: "default", fontWeight: "bold" }}>Queue</a>
                <ul>
                  {inQueue && (
                    <li>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/user/tableStatus/" + restaurantId)
                        }
                      >
                        View Queue Status
                      </a>
                    </li>
                  )}
                  {inQueue && (
                    <li>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (chosenGame === "wait") {
                            navigate("/user/customerWaitingGame");
                          } else {
                            navigate("/user/customerActionGame");
                          }
                        }}
                      >
                        Return To Game
                      </a>
                    </li>
                  )}
                  {inQueue && (
                    <li>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/user/queueRestaurantMenu/" + restaurantId)
                        }
                      >
                        Restaurant Menu
                      </a>
                    </li>
                  )}
                  {inQueue && (
                    <li>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/user/voucherPage/" + restaurantId)
                        }
                      >
                        View Vouchers
                      </a>
                    </li>
                  )}
                  {inQueue && (
                    <li>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate("/user/queueBookingModification")
                        }
                      >
                        Modify Seating Information
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            )}
            {inQueue && (
              <li>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    quitQueue().then(() => {
                      makeToast("success", "Quit From Queue");
                    });
                  }}
                >
                  Quit Queue
                </a>
              </li>
            )}
            <li>
              <a style={{ cursor: "default", fontWeight: "bold" }}>Setting</a>
              <ul>
                {" "}
                <li>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </a>
                </li>
                {!inQueue && (
                  <li>
                    <a style={{ cursor: "pointer" }} onClick={inOutStatus}>
                      Log Out
                    </a>
                  </li>
                )}
              </ul>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
