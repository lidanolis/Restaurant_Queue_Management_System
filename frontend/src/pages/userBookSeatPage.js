import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
function UserBookSeatPage() {
  const navigate = useNavigate();
  const {
    socket,
    setInQueue,
    userId,
    restaurantId,
    timeWaited,
    chosenGame,
    waitingPoints,
  } = useContext(UserContext);

  const pageParams = useParams();
  const tableName = pageParams.tableName;
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Seat</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>Thank You For Waiting, Please Proceed To:</label>
          </div>
          <div className="inputGroup">
            <input
              type="text"
              name="tableName"
              value={`Restaurant Table:  ${tableName}`}
              readOnly
            ></input>
          </div>
          <div className="inputGroup">
            <label style={{ fontSize: "75%", textAlign: "justify" }}>
              *The Following Seating Is Optimized. If The Seating Is Too Small,
              You May <strong>Request For Additional Chairs</strong> Or{" "}
              <strong>Request The Staffs To Reassign Seats</strong>. Thank You.
            </label>
          </div>
          <div>
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/user/home");
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserBookSeatPage;
