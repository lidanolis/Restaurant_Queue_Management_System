import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function UserVoucherPage({ voucherAccessType }) {
  const navigate = useNavigate();
  const { userId, socket, role, inQueue, setInQueue } = useContext(UserContext);
  const pageParams = useParams();
  const restaurantId = pageParams.restaurantId;
  const [voucherList, setVoucherList] = useState([]);
  const [voucherPoints, setVoucherPoints] = useState(0);

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
      setVoucherPoints(jsonfirst.userPoints);
    }
  };

  const getVoucherList = async () => {
    const getVoucher = await fetch(
      `http://localhost:8000/staff/getVoucher/${restaurantId}`
    );
    const resultJson = await getVoucher.json();
    if (getVoucher.ok) {
      setVoucherList(resultJson);
    } else {
      console.log("error");
    }
  };

  const manipulateDate = (unit, amount) => {
    console.log("unit:" + unit);
    console.log("amount:" + amount);
    const currentDate = new Date();
    let manipulatedDate;

    switch (unit) {
      case "hour":
        manipulatedDate = new Date(
          currentDate.getTime() + amount * 60 * 60 * 1000
        );
        break;
      case "day":
        manipulatedDate = new Date(
          currentDate.getTime() + amount * 24 * 60 * 60 * 1000
        );
        break;
      case "week":
        manipulatedDate = new Date(
          currentDate.getTime() + amount * 7 * 24 * 60 * 60 * 1000
        );
        break;
      case "month":
        manipulatedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + amount,
          currentDate.getDate()
        );
        break;
      case "year":
        manipulatedDate = new Date(
          currentDate.getFullYear() + amount,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        break;
      default:
        manipulatedDate = currentDate;
    }
    return manipulatedDate;
  };

  const createNewVoucher = async (newCustomerVoucher) => {
    const createNewVou = await fetch(
      "http://localhost:8000/user/addVoucherToCustomer",
      {
        method: "POST",
        body: JSON.stringify(newCustomerVoucher),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await createNewVou.json();
    if (createNewVou.ok) {
      makeToast("success", "Voucher Acquired");
    }
  };

  useEffect(() => {
    getVoucherList().then(() => {
      getCustomer();
    });
  }, []);
  useEffect(() => {
    socket.on("getSeat", (message) => {
      if (message.userId === userId && role === "user") {
        if (message.restaurantId === restaurantId) {
          if (inQueue) {
            setInQueue(false);
            navigate(`/user/seatPage/${message.tableName}`);
          }
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
            <th scope="col">Information</th>
            <th scope="col">Points Required</th>
            <th scope="col">Acquire Method</th>
            <th scope="col">Duration</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {voucherList.map(
            (item, index) =>
              item.voucherStatus !== "remove" && (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.voucherInformation}</td>
                  <td>{item.pointsRequired}</td>
                  <td>{item.voucherAcquireMethod}</td>
                  <td>{item.voucherDuration}</td>
                  <td>{item.durationType}</td>
                  <td>{item.voucherStatus}</td>
                  <td>
                    {item.pointsRequired <= voucherPoints && (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          console.log("voucher Id:" + item._id);
                          console.log("voucher points:" + item.pointsRequired);
                          var pointsLeft = voucherPoints - item.pointsRequired;
                          setVoucherPoints(pointsLeft);
                          var expirationDateForVoucher = manipulateDate(
                            item.durationType,
                            item.voucherDuration
                          );
                          const newCustomerVoucher = {
                            voucherId: item._id,
                            voucherExpiration: expirationDateForVoucher,
                            voucherStatus: "unuse",
                            userId: userId,
                            restaurantId: restaurantId,
                            userPoints: pointsLeft,
                          };
                          createNewVoucher(newCustomerVoucher);
                        }}
                      >
                        Acquire
                      </button>
                    )}
                  </td>
                </tr>
              )
          )}
          <tr>
            <td colSpan="8"></td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="button-container d-flex gap-2">
                <label>voucher Points</label>
                <input
                  type="text"
                  name="voucherPoints"
                  value={voucherPoints}
                  readOnly
                ></input>
              </div>
            </td>
            <td colSpan="6">
              <button
                className="btn btn-warning"
                onClick={() => {
                  console.log("entering personal voucher page");
                  if (voucherAccessType === "notqueue") {
                    navigate("/user/personalVouchers/" + restaurantId);
                  } else {
                    navigate("/user/personalVoucher/" + restaurantId);
                  }
                }}
              >
                My Vouchers
              </button>
            </td>
          </tr>
          <tr>
            <td colSpan="8">
              <button
                className="btn btn-success"
                onClick={() => {
                  console.log("voucherAccessType:" + voucherAccessType);
                  if (voucherAccessType === "notqueue") {
                    navigate("/user/join");
                  } else {
                    navigate("/user/home");
                  }
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
  );
}

export default UserVoucherPage;
