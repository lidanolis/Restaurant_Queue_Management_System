import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import NavBar from "../components/navBar";
import makeToast from "../toast";

function AdminChatbotPage() {
  const navigate = useNavigate();
  const {
    restaurantId,
    socket,
    restaurantChatbotMessage,
    setRestaurantChatbotMessage,
  } = useContext(UserContext);
  const quitQueue = () => {
    if (socket) {
      console.log("Left Room");
      const adminRoomID = restaurantId + "admin";
      socket.emit("leaveRoom", { restaurantId: adminRoomID });
    }
  };
  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      setRestaurantChatbotMessage(resultJson.chatbotSequence);
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    getRestaurantList();
  }, []);
  return (
    <div className="common">
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "15%" }} scope="col">
                #
              </th>
              <th scope="col">Chatbot</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {restaurantChatbotMessage.map((aMessage, index) => (
              <tr key={aMessage._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="button-container d-flex gap-2">
                    <label
                      className="form-check-label"
                      style={{ fontWeight: "bold" }}
                    >
                      Message Status:{" "}
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={aMessage.usePair}
                        disabled
                      />
                    </div>
                  </div>
                  <br />
                  <label
                    className="form-check-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Question:{" "}
                  </label>
                  <label className="form-check-label">
                    {aMessage.questionPair}
                  </label>{" "}
                  <br />
                  <label
                    className="form-check-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Answer:{" "}
                  </label>
                  <label className="form-check-label">
                    {aMessage.answerPair}
                  </label>{" "}
                  <br />
                  <label
                    className="form-check-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Path:{" "}
                  </label>
                  <label className="form-check-label">
                    {aMessage.pathPair}
                  </label>
                </td>
                <td>
                  <div>
                    <button
                      className="btnBasicDesignBlue"
                      onClick={() => {
                        navigate(`/admin/modifyChatbotManage/` + aMessage._id);
                      }}
                    >
                      Modify
                    </button>
                  </div>
                  <br />
                  <div>
                    <button
                      className="btnBasicDesignOrange"
                      onClick={() => {
                        navigate(`/admin/removeChatbotManage/` + aMessage._id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            <tr>
              <td>
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    quitQueue();
                    navigate("/admin/home");
                  }}
                >
                  Back
                </button>
              </td>
              <td colSpan="2">
                <button
                  className="btnBasicDesignGreen"
                  onClick={() => {
                    navigate("/admin/addChatbotManage/0");
                  }}
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminChatbotPage;
