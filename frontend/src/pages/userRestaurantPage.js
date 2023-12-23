import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserRestaurantPage() {
  const navigate = useNavigate();
  const { userId, restaurantId, setRestaurantId, socket } =
    useContext(UserContext);
  const pageParams = useParams();
  const joinRestaurantId = pageParams.id;

  const [restaurantTable, setRestaurantTable] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantChatbot, setRestaurantChatbot] = useState([]);
  const [restaurantDesc, setRestaurantDesc] = useState("");

  const getCustomer = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getCustomer/${restaurantId}/${userId}`
    );
    const jsonfirst = await response.json();
    if (!response.ok) {
      console.log("here actually, customer account not found");
      const newCustomer = {
        userId,
        restaurantId,
      };
      const createNewCustomer = await fetch(
        "http://localhost:8000/user/createNewCustomer",
        {
          method: "POST",
          body: JSON.stringify(newCustomer),
          headers: { "Content-Type": "application/json" },
        }
      );
      const json = await createNewCustomer.json();
      if (!createNewCustomer.ok) {
        console.log("Invalid Credentials");
      } else {
        console.log("Customer Created:" + json._id);
      }
    } else {
      console.log("Customer Already Exist:" + jsonfirst._id);
    }
  };

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
      } else {
        var restaurantTableList = [];
        restaurantTableList = json.restaurantTable;
        const foundObject = restaurantTableList.find(
          (obj) => obj.userId === userId
        );

        if (foundObject) {
          makeToast("warning", "You Are Already Assigned To A Seat");
          navigate("/user/join");
        } else {
          getCustomer();
        }
      }
    } else {
      makeToast("error", "Invalid");
      navigate("/user/join");
    }
  };

  const checkAdminRoom = () => {
    if (socket) {
      socket.emit("checkRoom", {
        restaurantId: joinRestaurantId + "admin",
        userId: userId,
        actionType: "queue",
      });
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
  }, []);

  useEffect(() => {
    checkAdminRoom();

    socket.on("RoomStatusResult", (message) => {
      console.log("userId:" + message.userId);
      console.log("actionType:" + message.actionType);
      console.log("status:" + message.message);
      if (message.userId === userId && message.actionType === "queue") {
        console.log("passed here for some reason");
        if (message.message !== "available") {
          makeToast(
            "warning",
            "Restaurant Is Currently Under Maintenance, Please Come Back Later"
          );
          navigate("/user/join");
        }
      }
    });
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
