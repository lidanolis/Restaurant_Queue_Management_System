import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import NavBar from "../components/navBar";
import makeToast from "../toast";

function AdminChatbotPage() {
  const navigate = useNavigate();
  const { restaurantId, socket } = useContext(UserContext);
  const quitQueue = () => {
    if (socket) {
      const adminRoomID = restaurantId + "admin";
      socket.emit("leaveRoom", { restaurantId: adminRoomID });
    }
  };
  return (
    <div className="container mt-4 mb-4">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Chatbot</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                />
                <label
                  className="form-check-label"
                  for="flexSwitchCheckDefault"
                >
                  Default switch checkbox input
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <button
                className="btn btn-warning"
                onClick={() => {
                  quitQueue();
                  navigate("/admin/home");
                }}
              >
                Back
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminChatbotPage;
