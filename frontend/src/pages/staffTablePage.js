import React, { useEffect, useState, useContext } from "react";
import makeToast from "../toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
function StaffTablePage() {
  const navigate = useNavigate();
  const { restaurantId, socket } = useContext(UserContext);

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantTable, setRestaurantTable] = useState([]);
  const [chatbotSequence, setChatbotSequence] = useState([]);

  const getRestaurantList = async () => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      setRestaurantName(resultJson.restaurantName);
      setRestaurantDescription(resultJson.restaurantDescription);
      setRestaurantTable(resultJson.restaurantTable);
      setChatbotSequence(resultJson.chatbotSequence);

      console.log("restaurantName-" + resultJson.restaurantName);
      console.log("restaurantDescription-" + resultJson.restaurantDescription);
      console.log("restaurantTable-" + resultJson.restaurantTable);
      console.log("chatbotSequence-" + resultJson.chatbotSequence);
    } else {
      console.log("error");
    }
  };
  const quitQueue = () => {
    if (socket) {
      const staffRoomId = restaurantId + "staff";
      socket.emit("leaveRoom", { restaurantId: staffRoomId });
    }
  };
  const assignSeat = async (numberOfTimes) => {
    await QueueManagementController(restaurantId, socket, numberOfTimes);
  };
  useEffect(() => {
    const staffRoomId = restaurantId + "staff";
    console.log("staffRoomId " + staffRoomId);
    if (socket) {
      socket.emit("joinRoom", { restaurantId: staffRoomId });
    }
  }, []);
  useEffect(() => {
    getRestaurantList();
  }, []);

  return (
    <div className="container mt-4 mb-4">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Restaurant Table</th>
            <th scope="col">Table Quantity</th>
            <th scope="col">Table Status</th>
            <th scope="col">Occupancy</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {restaurantTable.map((item, index) => (
            <tr key={item.tableName}>
              <th scope="row">{index + 1}</th>
              <td>{item.tableName}</td>
              <td>{item.tableQuantity}</td>
              <td>{item.tableStatus}</td>
              <td>{item.userId}</td>
              <td>
                <Link to={"/staff/modifyRestaurantTable/" + item.tableName}>
                  <div className="btn btn-success">Modify</div>
                </Link>
              </td>
              {item.tableStatus === "occupied" && (
                <td>
                  <Link to={"/staff/customerVoucherManage/" + item.userId}>
                    <div className="btn btn-warning">Customer Voucher</div>
                  </Link>
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td colSpan="7">
              <button
                className="btn btn-warning"
                onClick={() => {
                  quitQueue();
                  var numberOfTimes = 0;
                  restaurantTable.forEach((aTable) => {
                    if (aTable.tableStatus === "available") {
                      numberOfTimes++;
                    }
                  });
                  assignSeat(numberOfTimes);
                  navigate("/staff/home");
                }}
              >
                Back
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />

      <br />
    </div>
  );
}

export default StaffTablePage;
