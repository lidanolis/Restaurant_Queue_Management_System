import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

import QRCode from "qrcode.react";

function AdminQRcodePage() {
  const navigate = useNavigate();
  const { restaurantId } = useContext(UserContext);

  const download = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="common">
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Restaurant QR Code</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <div>
                  {" "}
                  <QRCode
                    id="QRCode"
                    value={
                      "http://localhost:3000/user/restaurant/" + restaurantId
                    }
                    size={350}
                    bgColor={"#ffffff"}
                    fgColor={"#1f1e1e"}
                    level={"L"}
                    renderAs={"svg"}
                    imageSettings={{
                      src: "https://static.zpao.com/favicon.png",
                      x: null,
                      y: null,
                      height: 24,
                      width: 24,
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    navigate("/staff/home");
                  }}
                >
                  Back
                </button>
              </td>
              <td>
                <button className="btnBasicDesignGreen" onClick={download}>
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminQRcodePage;
