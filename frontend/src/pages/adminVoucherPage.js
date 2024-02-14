import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function AdminVoucherPage() {
  const navigate = useNavigate();
  const { restaurantId } = useContext(UserContext);
  const [voucherList, setVoucherList] = useState([]);

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

  const removeFunction = async (id) => {
    const manageAVoucher = await fetch(
      `http://localhost:8000/staff/removeVoucher/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await manageAVoucher.json();
    if (!manageAVoucher.ok) {
      console.log("Invalid Credentials");
    } else {
      makeToast("success", `Successful Remove action`);
    }
  };

  useEffect(() => {
    getVoucherList();
  }, []);

  return (
    <div className="common">
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Information</th>
              <th scope="col">Points Required</th>
              <th scope="col">Type</th>
              <th scope="col">Duration</th>
              <th scope="col"></th>
              <th scope="col">Status</th>
              <th scope="col"></th>
              <th scope="col"></th>
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
                      <Link to={"/admin/adminVoucherModifyPage/" + item._id}>
                        <div className="link btnBasicDesign">Modify</div>
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btnBasicDesignOrange"
                        onClick={() => {
                          removeFunction(item._id).then(() => {
                            navigate("/admin/adminVoucherRemovePage/" + 0);
                          });
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
            )}
            <tr>
              <td colSpan="9"></td>
            </tr>
            <tr>
              <td colSpan="4">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    navigate("/admin/home");
                  }}
                >
                  Back
                </button>
              </td>
              <td colSpan="5">
                <button
                  className="btnBasicDesignGreen"
                  onClick={() => {
                    navigate("/admin/adminVoucherAddPage/" + 0);
                  }}
                >
                  Add
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

export default AdminVoucherPage;
