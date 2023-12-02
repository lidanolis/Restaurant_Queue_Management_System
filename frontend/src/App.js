import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage";
import Register from "./pages/registerPage";
import Login from "./pages/loginPage";
import StaffHomePage from "./pages/staffHomePage";
import ProfilePage from "./pages/profilePage";
import { useState } from "react";
import { UserContext } from "./context/userContext";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [role, setrole] = useState("");
  const [userId, setUserId] = useState("");

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
      }}
    >
      <div>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<Home></Home>} />
              <Route
                path="/staff/register"
                element={<Register specificRole="staff"></Register>}
              />
              <Route
                path="/user/register"
                element={<Register specificRole="user"></Register>}
              />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/home" element={<Home></Home>} />
              <Route
                path="/staff/home"
                element={<StaffHomePage></StaffHomePage>}
              />
              <Route path="/profile" element={<ProfilePage></ProfilePage>} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
