import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import ChatBot from "../components/chatBot";
function UserHomePage() {
  const navigate = useNavigate();
  const { socket, inQueue, setInQueue, role, userId, restaurantId } =
    useContext(UserContext);
  useEffect(() => {
    socket.on("getSeat", (message) => {
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
  return (
    <div>
      <NavBar></NavBar>
      {inQueue && <ChatBot></ChatBot>}
    </div>
  );
}

export default UserHomePage;
