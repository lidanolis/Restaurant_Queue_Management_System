import React, { useEffect, useState, useContext } from "react";
import makeToast from "../toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { QueueManagementController } from "../controller/queueManageController";
import { UserNameLocatingController } from "../controller/userNameLocatingController";

function StaffTablePage() {
  const navigate = useNavigate();
  const { restaurantId, socket, userId } = useContext(UserContext);

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
      const restaurantDataList = await Promise.all(
        resultJson.restaurantTable.map(async (aData) => {
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
      setRestaurantName(resultJson.restaurantName);
      setRestaurantDescription(resultJson.restaurantDescription);
      setRestaurantTable(restaurantDataList);
      setChatbotSequence(resultJson.chatbotSequence);
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
    <div className="common">
      <div className="whiteBox">
        <div className="rowdisplay">
          <div>
            <label style={{ textAlign: "center" }} className="form-check-label">
              Please Note That Seat Assignment Will Be Disabled When Staff Is
              Using This Page
            </label>
          </div>
        </div>
      </div>

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
                <td>{item.userName}</td>
                <td>
                  <Link to={"/staff/modifyRestaurantTable/" + item.tableName}>
                    <div className="link btnBasicDesignOrange">
                      Modify Availability
                    </div>
                  </Link>
                </td>
                {item.tableStatus !== "occupied" && <td colSpan="2"></td>}
                {item.tableStatus === "occupied" && (
                  <td>
                    <Link to={"/staff/staffSeatUserChange/" + item.tableName}>
                      <div className="link btnBasicDesignYellow">
                        Change Seat
                      </div>
                    </Link>
                  </td>
                )}
                {item.tableStatus === "occupied" && (
                  <td>
                    <Link to={"/staff/customerVoucherManage/" + item.userId}>
                      <div className="link btnBasicDesignGreen">
                        Customer Voucher
                      </div>
                    </Link>
                  </td>
                )}
              </tr>
            ))}
            <tr>
              <td colSpan="8">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    quitQueue();
                    var numberOfTimes = 0;
                    restaurantTable.forEach((aTable) => {
                      if (aTable.tableStatus === "available") {
                        numberOfTimes++;
                      }
                    });
                    console.log("number of Counted Times: " + numberOfTimes);
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
    </div>
  );
}

export default StaffTablePage;
