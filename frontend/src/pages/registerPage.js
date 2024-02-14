import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function RegisterPage({ specificRole }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDesc, setRestaurantDesc] = useState("");

  const RoleRef = useRef(null);
  var role = specificRole;

  const { restaurantId } = useContext(UserContext);
  var adminRestaurantId = restaurantId;

  const createRestaurant = async () => {
    const newRes = { restaurantName, restaurantDescription: restaurantDesc };
    const createNewRes = await fetch(
      "http://localhost:8000/staff/createRestaurant",
      {
        method: "POST",
        body: JSON.stringify(newRes),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await createNewRes.json();
    if (!createNewRes.ok) {
      console.log("Invalid Credentials");
      return null;
    } else {
      console.log(`Registered New Restaurant ${json.restaurantName}`);
      return json._id;
    }
  };

  const setStaff = async (userId, restaurantId) => {
    const setStaffRes = {
      userId,
      restaurantId,
    };
    const createSetStaffRes = await fetch(
      "http://localhost:8000/staff/setStaff",
      {
        method: "POST",
        body: JSON.stringify(setStaffRes),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await createSetStaffRes.json();
    if (!createSetStaffRes.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log(`Restaurant Set for Staff ${json.restaurantId}`);
    }
  };

  const registerUser = async () => {
    if (
      username.length === 0 ||
      password.length === 0 ||
      email.length === 0 ||
      contact.length === 0
    ) {
      makeToast("error", "Please Input All Required Credentials");
    } else {
      if (
        role === "admin" &&
        (restaurantName.length === 0 || restaurantDesc.length === 0)
      ) {
        makeToast("error", "Please Input All Required Credentials");
      } else {
        try {
          role =
            specificRole === "staff"
              ? RoleRef.current.value
              : specificRole === "admin"
              ? "admin"
              : "user";
          const newStaff = { name: username, email, password, contact, role };
          console.log(JSON.stringify(newStaff));
          const emailRegex = /@gmail\.com$/;

          if (!emailRegex.test(email)) {
            makeToast("error", "Invalid Email Format");
          } else if (password.length < 6) {
            makeToast("error", "Password Must Be At Least 6 Character Long");
          } else if (username.length < 2) {
            makeToast("error", "Username Must Be At Least 2 Character Long");
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

              if (role === "admin") {
                setRestaurantName("");
                setRestaurantDesc("");
              }

              console.log("Invalid Credentials after Login: " + json.mssg);
              makeToast("error", "Invalid Credentials");
            } else {
              setUsername("");
              setPassword("");
              setEmail("");
              setContact("");

              if (role === "admin") {
                setRestaurantName("");
                setRestaurantDesc("");
              }

              makeToast("success", `Registered New ${role} ${json.name}`);

              if (role === "admin") {
                const newRestaurantId = await createRestaurant();
                setStaff(json._id, newRestaurantId).then(() => {
                  navigate("/home");
                });
              } else if (role === "staff") {
                console.log("restaurant Id = " + adminRestaurantId);
                setStaff(json._id, adminRestaurantId).then(() => {
                  navigate("/admin/home");
                });
              } else {
                navigate("/home");
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">{role} Registration</div>
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
          {specificRole === "admin" && (
            <div>
              <div className="inputGroup">
                <label htmlFor="restaurantName">Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  id="restaurantName"
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                  }}
                  placeholder="Restaurant Information Here"
                  value={restaurantName}
                ></input>
              </div>
              <div className="inputGroup">
                <label htmlFor="restaurantDesc">Restaurant Description</label>
                <input
                  type="text"
                  name="restaurantDesc"
                  id="restaurantDesc"
                  placeholder="Restaurant Description Here"
                  onChange={(e) => {
                    setRestaurantDesc(e.target.value);
                  }}
                  value={restaurantDesc}
                ></input>
              </div>
            </div>
          )}
          <div className="button-container d-flex gap-2">
            <button onClick={registerUser} className="btnBasicDesignGreen">
              Register
            </button>
            <button
              className="btnBasicDesign"
              onClick={() => {
                if (specificRole === "staff") {
                  navigate("/admin/home");
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
    </div>
  );
}

export default RegisterPage;
