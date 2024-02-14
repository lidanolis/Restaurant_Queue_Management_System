import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";

function AdminMenuPage() {
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
  const [chosenImage, setChosenImage] = useState("");
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const convertToBase64 = (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > 76 * 1024) {
        makeToast("error", "Image Is Too Big (Exceeded 75 kb)");
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
          console.log(reader.result);
          setChosenImage(reader.result);
        };
        reader.onerror = (error) => {
          console.log("Error: " + error);
        };
      }
    } catch (err) {
      makeToast("error", "Invalid Image, Retry Again");
    }
  };

  const quitQueue = () => {
    if (socket) {
      console.log("Left Room");
      const adminRoomID = restaurantId + "admin";
      socket.emit("leaveRoom", { restaurantId: adminRoomID });
    }
  };

  const uploadImage = async () => {
    const newRestaurantImage = {
      restaurantId: restaurantId,
      imageString: chosenImage,
      stringType: "menu",
    };
    const createNewRestaurantImage = await fetch(
      "http://localhost:8000/staff/addRestaurantImage",
      {
        method: "POST",
        body: JSON.stringify(newRestaurantImage),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await createNewRestaurantImage.json();
    if (createNewRestaurantImage.ok) {
      makeToast("success", "Successfully Uploaded Image");
      setChosenImage("");
      getRestaurantMenu();
    }
  };

  const getRestaurantMenu = async () => {
    const response = await fetch(
      `http://localhost:8000/staff/getRestaurantMenu/${restaurantId}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });

    if (response.ok) {
      setRestaurantMenu(json);
    }
  };
  const removeRestaurantMenu = async (id) => {
    console.log("id-" + id);
    const response = await fetch(
      `http://localhost:8000/staff/removeRestaurantMenu/${id}`
    ).catch((err) => {
      console.log("error here: " + err);
    });
    const json = await response.json().catch((err) => {
      console.log("error here instead: " + err);
    });
    if (response.ok) {
      makeToast("success", "Image Removed");
    }
  };

  useEffect(() => {
    getRestaurantMenu();
  }, []);
  return (
    <div className="common">
      <div className="container mt-4 mb-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "12%" }} scope="col">
                #
              </th>
              <th scope="col">Restaurant Menu</th>
              <th style={{ width: "25%" }} scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {restaurantMenu.map((anImage, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <img width={"25%"} height={"25%"} src={anImage.imageString} />
                </td>
                <td>
                  <button
                    className="btnBasicDesignOrange"
                    onClick={() => {
                      removeRestaurantMenu(anImage._id).then(() => {
                        const updatedList = restaurantMenu.filter(
                          (item) => item._id !== anImage._id
                        );
                        setRestaurantMenu(updatedList);
                      });
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ backgroundColor: "lightgreen" }}>
              <td style={{ backgroundColor: "lightgreen" }}>-</td>
              <td style={{ backgroundColor: "lightgreen" }}>
                {chosenImage !== "" && chosenImage !== null && (
                  <img width={"25%"} height={"25%"} src={chosenImage} />
                )}
              </td>
              <td style={{ backgroundColor: "lightgreen" }}>
                <input
                  id="fileInput"
                  accept="image/*"
                  type="file"
                  onChange={convertToBase64}
                ></input>
                {chosenImage !== "" && chosenImage !== null && (
                  <button className="btnBasicDesignGreen" onClick={uploadImage}>
                    Upload
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                <button
                  className="btnBasicDesign"
                  onClick={() => {
                    quitQueue();
                    navigate("/admin/home");
                  }}
                >
                  Back
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMenuPage;
