import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function StaffVoucherManagePage() {
  const navigate = useNavigate();
  const { restaurantId, socket, role, inQueue, setInQueue } =
    useContext(UserContext);
  const pageParams = useParams();
  const userId = pageParams.id;
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

  const comparingDate = (dateToCompare) => {
    const malaysiaTimeOffset = 8 * 60 * 60 * 1000;
    const currentDateNow = new Date();

    // Calculate the total offset in milliseconds
    const totalOffset =
      malaysiaTimeOffset + currentDateNow.getTimezoneOffset() * 60 * 1000;

    // Apply the total offset to currentDateNow
    const currentDate = new Date(currentDateNow.getTime());

    const dateComparing = new Date(dateToCompare);
    console.log("currentDate-" + currentDate);
    console.log("dateComparing-" + dateComparing);
    if (dateComparing >= currentDate) {
      console.log("current Date is smaller, havent expire");
      return true;
    } else {
      console.log("current Date is bigger, expired");
      return false;
    }
  };

  const updateVoucher = async (voucherId, voucherStatus) => {
    const newVoucher = {
      restaurantId,
      userId,
      voucherStatus,
      voucherId,
    };
    const updateNewVoucher = await fetch(
      "http://localhost:8000/user/updateCustomerVoucher",
      {
        method: "POST",
        body: JSON.stringify(newVoucher),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewVoucher.json();
    if (!updateNewVoucher.ok) {
      console.log("Invalid Credentials");
    } else {
      makeToast("success", "Voucher Updated");
      console.log("Voucher Updated");
    }
    navigate("/staff/viewTable");
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
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {personalVoucherList.map((item, index) => {
              const foundObject = voucherList.find(
                (obj) => obj._id === item.voucherId
              );

              return (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{foundObject.voucherInformation}</td>
                  <td>{foundObject.voucherAcquireMethod}</td>
                  <td>{item.malaysiaFormatTime}</td>
                  <td colSpan="2">{item.voucherStatus}</td>
                  {!comparingDate(item.voucherExpiration) && <td></td>}
                  {comparingDate(item.voucherExpiration) &&
                    item.voucherStatus === "use" && (
                      <td>
                        <button
                          className="btnBasicDesignOrange"
                          onClick={() => {
                            var voucherStat;
                            if (item.voucherStatus === "use") {
                              voucherStat = "unuse";
                            } else {
                              voucherStat = "use";
                            }
                            updateVoucher(item._id, voucherStat);
                          }}
                        >
                          Change To Un-use
                        </button>
                      </td>
                    )}
                  {comparingDate(item.voucherExpiration) &&
                    item.voucherStatus === "unuse" && (
                      <td>
                        <button
                          className="btnBasicDesignBlue"
                          onClick={() => {
                            var voucherStat;
                            if (item.voucherStatus === "use") {
                              voucherStat = "unuse";
                            } else {
                              voucherStat = "use";
                            }
                            updateVoucher(item._id, voucherStat);
                          }}
                        >
                          Change To Used
                        </button>
                      </td>
                    )}
                </tr>
              );
            })}

            <tr>
              <td colSpan="9"></td>
            </tr>
            <tr>
              <td colSpan="9">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    navigate("/staff/viewTable");
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

export default StaffVoucherManagePage;
