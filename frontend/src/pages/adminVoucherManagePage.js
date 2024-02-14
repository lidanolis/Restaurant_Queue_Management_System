import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function AdminVoucherManagePage({ managementFunction }) {
  const navigate = useNavigate();
  const pageParams = useParams();
  const voucherId = pageParams.id;
  const { restaurantId } = useContext(UserContext);
  const [voucherInformation, setVoucherInformation] = useState("none");
  const voucherAcquireMethodRef = useRef("shop");
  const durationTypeRef = useRef("hour");
  const [pointsRequired, setPointsRequired] = useState(0);
  const [voucherDuration, setVoucherDuration] = useState(0);
  const voucherStatusRef = useRef("available");

  const modifySetup = async () => {
    const getVoucherId = await fetch(
      `http://localhost:8000/staff/getAVoucher/${voucherId}`
    );
    const resultJson = await getVoucherId.json();
    if (getVoucherId.ok) {
      setVoucherInformation(resultJson.voucherInformation);
      setPointsRequired(resultJson.pointsRequired);
      voucherAcquireMethodRef.current.value = resultJson.voucherAcquireMethod;
      durationTypeRef.current.value = resultJson.durationType;
      setVoucherDuration(resultJson.voucherDuration);
      voucherStatusRef.current.value = resultJson.voucherStatus;
    } else {
      console.log("error");
    }
  };

  const isValidNumericInput = (value) => {
    if (!isNaN(value) && Number.isInteger(Number(value))) {
      return Number(value) > 0;
    }
    return false;
  };

  const manageFunction = async () => {
    const createAVoucher = {
      restaurantId: restaurantId,
      voucherInformation: voucherInformation,
      pointsRequired: pointsRequired,
      voucherAcquireMethod: voucherAcquireMethodRef.current.value,
      voucherDuration: voucherDuration,
      durationType: durationTypeRef.current.value,
      voucherStatus: voucherStatusRef.current.value,
    };

    const manageVoucherURL =
      managementFunction === "add"
        ? "http://localhost:8000/staff/addVoucher"
        : `http://localhost:8000/staff/updateVoucher/${voucherId}`;
    const manageAVoucher = await fetch(manageVoucherURL, {
      method: "POST",
      body: JSON.stringify(createAVoucher),
      headers: { "Content-Type": "application/json" },
    });
    const json = await manageAVoucher.json();
    if (!manageAVoucher.ok) {
      console.log("Invalid Credentials");
    } else {
      makeToast("success", `Successful ${managementFunction} action`);
    }
  };

  useEffect(() => {
    if (managementFunction === "modify") {
      modifySetup();
    } else if (managementFunction === "remove") {
      navigate("/admin/home");
    }
  }, []);
  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Voucher</div>
        <div className="cardBody">
          <div className="inputGroup">
            <label>Voucher Information</label>
            <input
              type="text"
              name="voucherInformation"
              onChange={(e) => {
                setVoucherInformation(e.target.value);
              }}
              value={voucherInformation}
            ></input>
          </div>
          <div className="inputGroup">
            <label>Points Required</label>
            <input
              type="text"
              name="pointsRequired"
              onChange={(e) => {
                setPointsRequired(e.target.value);
              }}
              value={pointsRequired}
            ></input>
          </div>
          <div className="inputGroup">
            <label>Voucher Type</label>
            <select
              name="voucherAcquireMethodRef"
              defaultValue={voucherAcquireMethodRef.current.value}
              ref={voucherAcquireMethodRef}
              className="form-select"
            >
              <option value="promotional">promotional</option>
              <option value="shop">shop</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>Voucher Duration</label>
            <div className="button-container d-flex gap-2">
              <input
                type="text"
                name="voucherDuration"
                onChange={(e) => {
                  setVoucherDuration(e.target.value);
                }}
                value={voucherDuration}
              ></input>
              <select
                name="durationTypeRef"
                defaultValue={durationTypeRef.current.value}
                ref={durationTypeRef}
                className="form-select"
              >
                <option value="hour">hour</option>
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
                <option value="year">year</option>
              </select>
            </div>
          </div>
          <div className="inputGroup">
            <label>Voucher Status</label>
            <select
              name="voucherStatusRef"
              defaultValue={voucherStatusRef.current.value}
              ref={voucherStatusRef}
              className="form-select"
            >
              <option value="available">available</option>
              <option value="unavailable">unavailable</option>
            </select>
          </div>
          <div className="button-container d-flex gap-2">
            <button
              onClick={() => {
                if (
                  isValidNumericInput(voucherDuration) &&
                  isValidNumericInput(pointsRequired)
                ) {
                  manageFunction();
                } else {
                  setVoucherDuration(0);
                  setPointsRequired(0);
                  makeToast("error", "Invalid Duration and/or Points");
                }
              }}
              className="btnBasicDesign"
            >
              {managementFunction}
            </button>
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/admin/voucher");
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminVoucherManagePage;
