import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function UserBookingPage() {
  const navigate = useNavigate();
  const { socket } = useContext(UserContext);
  const [restaurantData, setRestaurantData] = useState([]);

  const getAllRestaurants = async () => {
    const response = await fetch(
      "http://localhost:8000/user/getRestaurant"
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      setRestaurantData(json);
    }
  };

  const joinQueue = async (restaurantId) => {
    if (socket) {
      socket.emit("joinRoom", { restaurantId });
    }
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  return (
    <div className="common">
      <div className="whiteBox">
        <div className="rowdisplay">
          <div>
            <label style={{ textAlign: "center" }} className="form-check-label">
              Please Wait For Your Booked Seat At Least 10 Minutes Before The
              Booked Time
            </label>
          </div>
        </div>
      </div>
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Restaurant Name</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {restaurantData.map(
              (item, index) =>
                item.restaurantTable.length > 0 && (
                  <tr key={item._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.restaurantName}</td>
                    <td>
                      <button
                        className="link btnBasicDesignYellow"
                        onClick={() => {
                          joinQueue(item._id).then(() => {
                            navigate("/user/seatBookWaiting/" + item._id);
                          });
                        }}
                      >
                        Wait For Booked Seat
                      </button>
                    </td>
                  </tr>
                )
            )}
            <tr>
              <td colSpan="3">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    navigate("/user/home");
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

export default UserBookingPage;
