import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
function UserWaitSeatPage() {
  const navigate = useNavigate();
  const pageParams = useParams();
  const restaurantId = pageParams.restaurantId;

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
    socket,
    inQueue,
    setInQueue,
    setRestaurantId,
  } = useContext(UserContext);

  const quitQueue = async () => {
    if (socket) {
      socket.emit("leaveRoom", { restaurantId });
    }
  };

  const checkStaffRoom = () => {
    if (socket) {
      socket.emit("checkRoom", {
        restaurantId: restaurantId + "staff",
        userId: userId,
        actionType: "bookQueueCheck",
      });
    }
  };

  const assignSeat = async () => {
    await QueueManagementController(restaurantId, socket, 1);
  };

  useEffect(() => {
    checkStaffRoom();
  }, []);

  useEffect(() => {
    const handleGetSeat = (message) => {
      console.log("Triggered Seat Assignment: Existing UserId-", userId);
      console.log(
        "Triggered Seat Assignment: Existing restaurantId-",
        restaurantId
      );
      console.log("Received userId-", message.userId);
      console.log("Received restaurantId-", message.restaurantId);
      if (
        message.userId === userId &&
        role === "user" &&
        restaurantId === message.restaurantId
      ) {
        setRestaurantId(message.restaurantId);
        navigate(`/user/seatBookFound/${message.tableName}`);
      }
    };

    socket.on("getSeat", handleGetSeat);

    return () => {
      socket.off("getSeat", handleGetSeat);
    };
  }, []);

  useEffect(() => {
    const handleCheckBooking = (message) => {
      if (message.userId === userId) {
        if (
          message.message === "available" &&
          message.actionType === "bookQueueCheck"
        ) {
          assignSeat();
        }
      }
    };

    socket.on("RoomStatusResult", handleCheckBooking);

    return () => {
      socket.off("RoomStatusResult", handleCheckBooking);
    };
  }, []);

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Book Seat</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>Patiently Finding You A Seat</label>
          </div>
        </div>
        <div>
          <button
            className="link btnBasicDesign"
            onClick={() => {
              quitQueue().then(() => {
                navigate("/user/selectingSeatBooking");
              });
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserWaitSeatPage;
