import React, { useEffect, useState, useContext } from "react";
import makeToast from "../toast";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";

function AdminTablePage() {
  const navigate = useNavigate();
  const { restaurantId } = useContext(UserContext);

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
              <td>
                <Link to={"/admin/modifyRestaurantTable/" + item.tableName}>
                  <div className="btn btn-success">Modify</div>
                </Link>
              </td>
              <td>
                <Link to={"/admin/removeRestaurantTable/" + item.tableName}>
                  <div className="btn btn-danger">Remove</div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div style={{ width: "100%" }}>
        <Link to={"/admin/home"}>
          <div
            className="btn btn-primary"
            style={{ width: "48%", margin: "5px" }}
          >
            Back
          </div>
        </Link>
        <Link to={"/admin/addRestaurantTable/0"}>
          <div
            className="btn btn-warning"
            style={{ width: "48%", margin: "5px" }}
          >
            Add Table
          </div>
        </Link>
      </div>
      <br />
    </div>
  );
}

export default AdminTablePage;
