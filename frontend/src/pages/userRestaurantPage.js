import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserRestaurantPage() {
  const navigate = useNavigate();
  const { userId, restaurantId, setRestaurantId } = useContext(UserContext);
  const pageParams = useParams();
  const joinRestaurantId = pageParams.id;

  const [restaurantTable, setRestaurantTable] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantChatbot, setRestaurantChatbot] = useState([]);
  const [restaurantDesc, setRestaurantDesc] = useState("");

  const getRestaurantData = async () => {
    setRestaurantId(joinRestaurantId);
    console.log("restaurant id" + joinRestaurantId);
    const response = await fetch(
      `http://localhost:8000/user/getARestaurant/${joinRestaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
      makeToast("error", "Invalid");
      navigate("/user/join");
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
      makeToast("error", "Invalid");
      navigate("/user/join");
    });

    if (response.ok) {
      setRestaurantTable(json.restaurantTable);
      setRestaurantName(json.restaurantName);
      setRestaurantChatbot(json.chatbotSequence);
      setRestaurantDesc(json.restaurantDescription);
      console.log("name " + json.restaurantName);
      console.log("desc " + json.restaurantDescription);
      console.log("chatbot " + json.chatbotSequence);
      console.log("table " + json.restaurantTable);
      console.log("table count " + json.restaurantTable.length);

      if (json.restaurantTable.length === 0) {
        makeToast("warning", "Restaurant Is Not Applicable To be Opened Yet");
        navigate("/user/join");
      }
    } else {
      makeToast("error", "Invalid");
      navigate("/user/join");
    }
  };

  useEffect(() => {
    if (userId === "") {
      makeToast(
        "warning",
        "Please Login To Your Account Before Joining Any Restaurant"
      );
      setRestaurantId(joinRestaurantId);
      navigate("/user/login");
    }
    getRestaurantData();
  });
  return (
    <div className="container mt-4 mb-4">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Restaurant Table</th>
            <th scope="col">Table Quantity</th>
            <th scope="col">Table Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div style={{ width: "100%" }}>
        <Link to={"/user/join"}>
          <div
            className="btn btn-primary"
            style={{ width: "48%", margin: "5px" }}
          >
            Back
          </div>
        </Link>
        <Link to={"/user/joinQueue"}>
          <div
            className="btn btn-warning"
            style={{ width: "48%", margin: "5px" }}
          >
            Join Queue
          </div>
        </Link>
      </div>
      <br />
    </div>
  );
}

export default UserRestaurantPage;
