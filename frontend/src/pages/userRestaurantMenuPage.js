import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserRestaurantMenuPage({ menuType }) {
  const pageParams = useParams();
  const joinRestaurantId = pageParams.id;
  const navigate = useNavigate();
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
    restaurantId,
    socket,
    inQueue,
    setInQueue,
  } = useContext(UserContext);
  const [restaurantMenu, setRestaurantMenu] = useState([]);

  const getRestaurantMenu = async () => {
    const response = await fetch(
      `http://localhost:8000/user/getRestaurantMenu/${joinRestaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      setRestaurantMenu(json);
    }
  };

  useEffect(() => {
    getRestaurantMenu();
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
              <th
                style={{
                  fontSize: "25px",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
                scope="col"
              >
                Restaurant Menu
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurantMenu.map((anImage) => (
              <tr>
                <td
                  style={{ width: "50%", height: "50%", textAlign: "center" }}
                >
                  <img
                    style={{
                      width: "50%",
                      height: "50%",
                      objectFit: "cover",
                    }}
                    src={anImage.imageString}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td colSpan="3">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    if (menuType === "queue") {
                      navigate("/user/home");
                    } else {
                      navigate("/user/join");
                    }
                  }}
                >
                  Back
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserRestaurantMenuPage;
