import React, { useContext, useEffect, useState, useRef } from "react";
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
  const [waitingTimeRequired, setWaitingTimeRequired] = useState(0);
  const [waitingTimeType, setWaitingTimeType] = useState("");

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
      setWaitingTimeRequired(json.estimatedWaitTime);
      setWaitingTimeType(json.estimatedWaitTimeFormat);

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

  const checkSeating = async () => {
    const response = await fetch(
      `http://localhost:8000/user/checkRestaurantSeats/${userId}`
    );
    const foundSeat = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      makeToast("error", "You Are Currently In Seat");
    } else {
      navigate("/user/joinQueue");
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
    if (userId !== "") {
      checkAdminRoom();

      const handleRoomStatusResult = (message) => {
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
      };

      socket.on("RoomStatusResult", handleRoomStatusResult);

      return () => {
        socket.off("RoomStatusResult", handleRoomStatusResult);
      };
    }
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
            <tr>
              <td></td>
              <td>
                <Link to={"/user/join"}>
                  <div className="link btnBasicDesign">Back</div>
                </Link>
              </td>
              <td>
                <Link to={"/user/seatBooking"}>
                  <div className="link btnBasicDesignYellow">Book Seat</div>
                </Link>
              </td>
              <td>
                <button
                  className="link btnBasicDesignOrange"
                  onClick={checkSeating}
                >
                  Join Queue
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
    </div>
  );
}

export default UserRestaurantPage;
