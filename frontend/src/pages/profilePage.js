import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    username,
    setUsername,
    password,
    setPassword,
    email,
    contact,
    setContact,
    role,
    userId,
  } = useContext(UserContext);

  const getProfile = async () => {
    const response = await fetch(
      `http://localhost:8000/profile/${userId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      setUsername(json.name);
      setPassword(json.password);
      setContact(json.contact);
    }
  };

  const registerUser = async () => {
    if (
      username.length === 0 ||
      password.length === 0 ||
      contact.length === 0
    ) {
      makeToast("error", "Credentials Cannot Be Left Empty");
      getProfile();
    } else {
      try {
        const newProfile = { name: username, email, password, contact, role };
        console.log(JSON.stringify(newProfile));

        if (password.length < 6) {
          makeToast("error", "Password Must Be At Least 6 Character Long");
          getProfile();
        } else if (username.length < 6) {
          makeToast("error", "Username Must Be At Least 6 Character Long");
          getProfile();
        } else {
          const registernewProfile = await fetch(
            `http://localhost:8000/profile/${userId}`,
            {
              method: "POST",
              body: JSON.stringify(newProfile),
              headers: { "Content-Type": "application/json" },
            }
          );
          const json = await registernewProfile.json();
          if (!registernewProfile.ok) {
            console.log("Invalid Credentials" + json.mssg);
            makeToast("error", "Invalid Credentials");
            getProfile();
          } else {
            makeToast("success", "Updated Profile");
            getProfile();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">Profile</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            readOnly
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
        <div className="inputGroup">
          <label htmlFor="role">role</label>
          <input
            type="text"
            name="role"
            id="role"
            value={role}
            readOnly
          ></input>
        </div>
        <div className="button-container d-flex gap-2">
          <button onClick={registerUser} className="btn btn-warning">
            Update
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              if (role === "staff") {
                navigate("/staff/home");
              } else {
                navigate("/login");
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

export default ProfilePage;
