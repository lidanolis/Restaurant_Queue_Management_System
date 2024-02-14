import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import NavBar from "../components/navBar";
import { UserNameLocatingController } from "../controller/userNameLocatingController";
import { StaffMailLocatingController } from "../controller/staffMailLocatingController";
import { StaffStatusCheckingController } from "../controller/staffStatusCheckingController";
function AdminHomePage() {
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
    restaurantId,
    socket,
    inQueue,
    setInQueue,
  } = useContext(UserContext);
  const [allStaffList, setAllStaffList] = useState([]);
  const getAllStaffs = async () => {
    const response = await fetch(
      `http://localhost:8000/staff/getRestaurantStaffList/${restaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json();
    if (response.ok) {
      const staffJson = await Promise.all(
        json.map(async (aData) => {
          const userNameValue = await UserNameLocatingController(aData.userId);
          const userMailValue = await StaffMailLocatingController(aData.userId);
          const userStatusValue = await StaffStatusCheckingController(
            aData.userId
          );

          return {
            ...aData,
            userName: userNameValue,
            userMail: userMailValue,
            userStatus: userStatusValue,
          };
        })
      );

      setAllStaffList(staffJson);
    }
  };

  const removeStaff = async (staffId) => {
    const response = await fetch(
      `http://localhost:8000/staffRemoval/${staffId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json();
    if (response.ok) {
      makeToast("success", "Staff Removed");
      getAllStaffs();
    }
  };

  useEffect(() => {
    getAllStaffs();
  }, []);

  useEffect(() => {
    const handleAdminHomePageUpdate = (message) => {
      if (
        message.restaurantId === restaurantId &&
        message.actionType === "admin"
      ) {
        getAllStaffs();
      }
    };

    socket.on("homePageUpdate", handleAdminHomePageUpdate);

    return () => {
      socket.off("homePageUpdate", handleAdminHomePageUpdate);
    };
  }, []);

  return (
    <>
      <div className="common">
        <NavBar></NavBar>
      </div>
      <br />
      <br />
      <div className="whiteBox">
        <div className="rowdisplay">
          <div>
            <label
              className="form-check-label"
              style={{ fontSize: "150%", fontWeight: "bold" }}
            >
              Restaurant Staffs:{" "}
            </label>
          </div>
        </div>
      </div>
      <div className="whiteBox">
        {" "}
        <div className="container mt-4 mb-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Staff</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {allStaffList.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.userName}</td>
                  <td>{item.userMail}</td>
                  <td>{item.userStatus}</td>
                  {item.userStatus === "in" && <td></td>}
                  {item.userStatus === "out" && (
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          removeStaff(item.userId);
                        }}
                      >
                        Remove Staff
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminHomePage;
