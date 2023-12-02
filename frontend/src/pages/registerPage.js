import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";

function RegisterPage({ specificRole }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const RoleRef = useRef(null);
  var role = specificRole;

  const registerUser = async () => {
    if (
      username.length === 0 ||
      password.length === 0 ||
      email.length === 0 ||
      contact.length === 0
    ) {
      makeToast("error", "Please Input All Required Credentials");
    } else {
      try {
        role = specificRole === "staff" ? RoleRef.current.value : "user";
        const newStaff = { name: username, email, password, contact, role };
        console.log(JSON.stringify(newStaff));
        const emailRegex = /@gmail\.com$/;

        if (!emailRegex.test(email)) {
          makeToast("error", "Invalid Email Format");
        } else if (password.length < 6) {
          makeToast("error", "Password Must Be At Least 6 Character Long");
        } else if (username.length < 6) {
          makeToast("error", "Username Must Be At Least 6 Character Long");
        } else {
          const registerNewStaff = await fetch(
            "http://localhost:8000/register",
            {
              method: "POST",
              body: JSON.stringify(newStaff),
              headers: { "Content-Type": "application/json" },
            }
          );
          const json = await registerNewStaff.json();
          if (!registerNewStaff.ok) {
            setUsername("");
            setPassword("");
            setEmail("");
            setContact("");
            console.log("Invalid Credentials after Login: " + json.mssg);
            makeToast("error", "Invalid Credentials");
          } else {
            setUsername("");
            setPassword("");
            setEmail("");
            setContact("");
            makeToast("success", `Registered New Staff ${json.name}`);
            navigate("/home");
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">Staff Registration</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          ></input>
        </div>
        <div className="inputGroup">
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
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
              setPassword(e.target.value);
            }}
            value={password}
          ></input>
        </div>
        <div className="inputGroup">
          <label htmlFor="contact">contact</label>
          <input
            type="text"
            name="contact"
            id="contact"
            placeholder="your contact"
            onChange={(e) => {
              setContact(e.target.value);
            }}
            value={contact}
          ></input>
        </div>
        {specificRole === "staff" && (
          <div className="inputGroup">
            <label htmlFor="userRole">Role</label>
            <select
              name="userRole"
              id="userRole"
              defaultValue="user"
              ref={RoleRef}
              className="form-select"
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        )}
        <div className="button-container d-flex gap-2">
          <button onClick={registerUser} className="btn btn-warning">
            Register
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              if (specificRole === "staff") {
                navigate("/staff/home");
              } else {
                navigate("/home");
              }
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
