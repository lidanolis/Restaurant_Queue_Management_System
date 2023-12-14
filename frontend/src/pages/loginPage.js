import React, { useState, useContext } from "react";
import makeToast from "../toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const LoginPage = ({ specificUse, setupSocket }) => {
  var joining = specificUse;
  console.log("here-" + joining);
  const navigate = useNavigate();
  const {
    setUsername,
    setPassword,
    setEmail,
    setContact,
    setrole,
    setUserId,
    restaurantId,
    setRestaurantId,
  } = useContext(UserContext);
  const [loginPassword, setloginPassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");

  const loginUser = async () => {
    if (loginPassword.length === 0 || loginEmail.length === 0) {
      makeToast("error", "Please Input All Required Credentials");
    } else {
      try {
        const emailRegex = /@gmail\.com$/;
        if (!emailRegex.test(loginEmail)) {
          makeToast("error", "Invalid Email Format");
        } else if (loginPassword.length < 6) {
          makeToast("error", "Password Must Be At Least 6 Character Long");
        } else {
          try {
            const user = await fetch(
              `http://localhost:8000/login/${loginEmail}/${loginPassword}`
            );
            const json = await user.json();
            if (!user.ok) {
              console.log(json.error);
              makeToast("error", "Invalid Login");
            } else {
              setloginEmail("");
              setloginPassword("");
              makeToast("success", `Logged In as a ${json.role}`);

              console.log(JSON.stringify(json));
              setUsername(json.name);
              setPassword(json.password);
              setEmail(json.email);
              setContact(json.contact);
              setrole(json.role);
              setUserId(json._id);
              localStorage.setItem("CC_Token", json._id);
              setupSocket();
              if (json.role !== "user") {
                const getRestaurantId = await fetch(
                  `http://localhost:8000/staff/getStaff/${json._id}`
                );
                const resultJson = await getRestaurantId.json();
                if (getRestaurantId.ok) {
                  setRestaurantId(resultJson.restaurantId);
                }
                console.log(`Set Restaurant Id ${resultJson.restaurantId}`);
              }

              console.log(`name: ${json.name}`);
              console.log(`password: ${json.password}`);
              console.log(`email: ${json.email}`);
              console.log(`contact: ${json.contact}`);
              console.log(`role: ${json.role}`);
              console.log(`userId: ${json._id}`);

              if (json.role === "staff") {
                navigate("/staff/home");
              } else if (json.role === "admin") {
                navigate("/admin/home");
              } else {
                if (joining === "join") {
                  navigate(`/user/restaurant/${restaurantId}`);
                } else {
                  navigate("/user/home");
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            onChange={(e) => {
              setloginEmail(e.target.value);
            }}
            value={loginEmail}
          ></input>
        </div>
        <div className="inputGroup">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="your password"
            onChange={(e) => {
              setloginPassword(e.target.value);
            }}
            value={loginPassword}
          ></input>
        </div>
        <div className="button-container d-flex gap-2">
          <button className="btn btn-warning" onClick={loginUser}>
            Login
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              navigate("/home");
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
