import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

function NavBar() {
  const navigate = useNavigate();
  const { role } = useContext(UserContext);
  console.log(`navBar Role ${role}`);
  return (
    <nav
      style={{ backgroundColor: "rgba(255, 193, 7, 1)" }}
      className="navbar navbar-expand-lg navbar-light"
    >
      <a
        style={{ cursor: "default", fontWeight: "bold" }}
        className="navbar-brand mx-2"
      >
        {role.toUpperCase()}
      </a>

      <button
        className="navbar-toggler mx-2"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon mx-2"></span>
      </button>

      <div
        style={{ cursor: "pointer" }}
        className="collapse navbar-collapse mx-2"
        id="navbarNavAltMarkup"
      >
        {role === "staff" && (
          <div className="navbar-nav">
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link active mx-2"
              onClick={() => navigate("/staff/home")}
            >
              Home <span className="sr-only">(current)</span>
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/staff/register")}
            >
              Register New User
            </a>
            <a style={{ cursor: "pointer" }} className="nav-item nav-link mx-2">
              View Table
            </a>
            <a style={{ cursor: "pointer" }} className="nav-item nav-link mx-2">
              View Chatbot
            </a>
            <a
              style={{ cursor: "pointer" }}
              className="nav-item nav-link mx-2"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
