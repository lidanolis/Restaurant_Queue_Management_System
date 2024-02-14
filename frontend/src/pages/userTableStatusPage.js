import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserTableStatusPage() {
  const navigate = useNavigate();
  const { userId, restaurantId, role, inQueue, setInQueue, socket } =
    useContext(UserContext);
  const pageParams = useParams();
  const joinRestaurantId = pageParams.id;

  const [restaurantTable, setRestaurantTable] = useState([]);
  const [waitingTimeRequired, setWaitingTimeRequired] = useState(0);
  const [waitingTimeType, setWaitingTimeType] = useState("");
  const getRestaurantData = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getARestaurant/${joinRestaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
      makeToast("error", "Invalid");
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
      makeToast("error", "Invalid");
    });

    if (response.ok) {
      setRestaurantTable(json.restaurantTable);
      setWaitingTimeRequired(json.estimatedWaitTime);
      setWaitingTimeType(json.estimatedWaitTimeFormat);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);
  useEffect(() => {
    const handleGetSeat = (message) => {
      if (message.userId === userId && role === "user") {
        if (message.restaurantId === restaurantId) {
          if (inQueue) {
            setInQueue(false);
            navigate(`/user/seatPage/${message.tableName}`);
          }
        }
      } else if (role === "user" && message.restaurantId === restaurantId) {
        getRestaurantData();
      }
    };

    socket.on("getSeat", handleGetSeat);

    return () => {
      socket.off("getSeat", handleGetSeat);
    };
  }, []);
  return (
    <div className="common">
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Restaurant Table</th>
              <th scope="col">Table Quantity</th>
              <th scope="col">Table Status</th>
            </tr>
          </thead>
          <tbody>
            {restaurantTable.map((item, index) => (
              <tr key={item.tableName}>
                <th scope="row">{index + 1}</th>
                <td>{item.tableName}</td>
                <td>{item.tableQuantity}</td>
                <td>{item.tableStatus}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "125%",
                }}
              >
                Estimated Wait Time: {waitingTimeRequired} {waitingTimeType}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div style={{ width: "100%" }}>
          <Link to={"/user/home"}>
            <div className="link btnBasicDesign">Back</div>
          </Link>
        </div>
        <br />
      </div>
    </div>
  );
}

export default UserTableStatusPage;
