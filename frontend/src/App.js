import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Register from "./pages/registerPage";
import Login from "./pages/loginPage";
import StaffHomePage from "./pages/staffHomePage";
import AdminHomePage from "./pages/adminHomePage";
import ProfilePage from "./pages/profilePage";
import JoinRestaurantPage from "./pages/joinRestaurantPage";
import UserHomePage from "./pages/userHomePage";
import UserRestaurantPage from "./pages/userRestaurantPage";
import AdminTablePage from "./pages/adminTablePage";
import UserQueueInfoPage from "./pages/userQueueInfoPage";
import AdminTableManagePage from "./pages/adminTableManagePage";
import { useState } from "react";
import { UserContext } from "./context/userContext";
import io from "socket.io-client";
import makeToast from "./toast";

function App() {
  //socket useState below
  const [socket, setSocket] = useState(null);
  const [inQueue, setInQueue] = useState(false);
  const [book, setBook] = useState(null);
  //socket use State above

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [role, setrole] = useState("");
  const [userId, setUserId] = useState("");

  const [restaurantId, setRestaurantId] = useState("");

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");

    if (token && token.length > 0 && !socket) {
      const newsocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newsocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(() => {
          setupSocket();
        }, 3000);
        console.log("Socket disconnected");
      });

      newsocket.on("connection", () => {
        console.log("Socket connected");
      });
      setSocket(newsocket);
    }
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        contact,
        setContact,
        role,
        setrole,
        userId,
        setUserId,
        restaurantId,
        setRestaurantId,
        socket,
        setSocket,
        inQueue,
        setInQueue,
        book,
        setBook,
      }}
    >
      <div>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<Home></Home>} />
              <Route
                path="/admin/register"
                element={<Register specificRole="admin"></Register>}
              />
              <Route
                path="/staff/register"
                element={<Register specificRole="staff"></Register>}
              />
              <Route
                path="/user/register"
                element={<Register specificRole="user"></Register>}
              />
              <Route
                path="/user/login"
                element={
                  <Login specificUse="join" setupSocket={setupSocket}></Login>
                }
              />
              <Route
                path="/login"
                element={
                  <Login specificUse="none" setupSocket={setupSocket}></Login>
                }
              />
              <Route path="/home" element={<Home></Home>} />
              <Route
                path="/staff/home"
                element={<StaffHomePage></StaffHomePage>}
              />
              <Route
                path="/admin/home"
                element={<AdminHomePage></AdminHomePage>}
              />
              <Route
                path="/user/join"
                element={<JoinRestaurantPage></JoinRestaurantPage>}
              />
              <Route
                path="/user/home"
                element={<UserHomePage></UserHomePage>}
              />
              <Route path="/profile" element={<ProfilePage></ProfilePage>} />
              <Route
                path="/admin/viewTable"
                element={<AdminTablePage></AdminTablePage>}
              />
              <Route
                path="/user/restaurant/:id"
                element={<UserRestaurantPage></UserRestaurantPage>}
              ></Route>
              <Route
                path="/user/joinQueue"
                element={<UserQueueInfoPage></UserQueueInfoPage>}
              ></Route>
              <Route
                path="/admin/addRestaurantTable/:id"
                element={
                  <AdminTableManagePage managementFunction="add"></AdminTableManagePage>
                }
              ></Route>
              <Route
                path="/admin/modifyRestaurantTable/:id"
                element={
                  <AdminTableManagePage managementFunction="modify"></AdminTableManagePage>
                }
              ></Route>
              <Route
                path="/admin/removeRestaurantTable/:id"
                element={
                  <AdminTableManagePage managementFunction="remove"></AdminTableManagePage>
                }
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
