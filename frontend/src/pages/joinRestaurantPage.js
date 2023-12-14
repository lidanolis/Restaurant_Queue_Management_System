import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JoinRestaurantPage() {
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
  useEffect(() => {
    getAllRestaurants();
    console.log("here" + restaurantData);
  }, []);

  return (
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
          {restaurantData.map((item, index) => (
            <tr key={item._id}>
              <th scope="row">{index + 1}</th>
              <td>{item.restaurantName}</td>
              <td>
                <Link to={"/user/restaurant/" + item._id}>
                  <div className="btn btn-success">Join</div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JoinRestaurantPage;
