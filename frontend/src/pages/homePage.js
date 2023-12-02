import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="cardHeader">Home Page</div>
      <div className="cardBody">
        <button
          className="btn btn-warning"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
      <div className="cardBody">
        <button
          className="btn btn-warning"
          onClick={() => {
            navigate("/user/register");
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default HomePage;
