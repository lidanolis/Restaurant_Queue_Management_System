import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function UserPersonalVoucherPage({ voucherAccessType }) {
  const navigate = useNavigate();
  const { userId, socket, role, inQueue, setInQueue } = useContext(UserContext);
  const pageParams = useParams();
  const restaurantId = pageParams.restaurantId;
  const [voucherList, setVoucherList] = useState([]);
  const [personalVoucherList, setPersonalVoucherList] = useState([]);

  const getVoucherList = async () => {
    const getVoucher = await fetch(
      `http://localhost:8000/staff/getVoucher/${restaurantId}`
    );
    const resultJson = await getVoucher.json();
    if (getVoucher.ok) {
      setVoucherList(resultJson);
      const response = await fetch(
        `http://localhost:8000/user/getCustomer/${restaurantId}/${userId}`
      );
      const jsonfirst = await response.json();
      if (response.ok) {
        const vouchersJson = await Promise.all(
          jsonfirst.userVouchers.map(async (aData) => {
            const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
            const voucherDate = new Date(aData.voucherExpiration);
            const malaysiaVoucherDate = new Date(
              voucherDate.getTime() +
                malaysiaTimeOffset +
                new Date(voucherDate.getTime()).getTimezoneOffset() * 60 * 1000
            );

            const options = {
              timeZone: "Asia/Kuala_Lumpur", // Set the desired time zone
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short",
            };
            const readableDateString = malaysiaVoucherDate.toLocaleString(
              "en-US",
              options
            );
            return { ...aData, malaysiaFormatTime: readableDateString };
          })
        );

        setPersonalVoucherList(vouchersJson);
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getVoucherList();
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
              <th scope="col">#</th>
              <th scope="col">Information</th>
              <th scope="col">Type</th>
              <th scope="col">Expiration</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {personalVoucherList.map((item, index) => {
              const foundObject = voucherList.find(
                (obj) => obj._id === item.voucherId
              );

              return (
                <tr key={item.voucherId}>
                  <th scope="row">{index + 1}</th>
                  <td>{foundObject.voucherInformation}</td>
                  <td>{foundObject.voucherAcquireMethod}</td>
                  <td>{item.malaysiaFormatTime}</td>
                  <td>{item.voucherStatus}</td>
                </tr>
              );
            })}

            <tr>
              <td colSpan="8"></td>
            </tr>
            <tr>
              <td colSpan="8">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    console.log("voucherAccessType:" + voucherAccessType);
                    if (voucherAccessType === "notqueue") {
                      navigate("/user/vouchersPage/" + restaurantId);
                    } else {
                      navigate("/user/voucherPage/" + restaurantId);
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
    </div>
  );
}

export default UserPersonalVoucherPage;
