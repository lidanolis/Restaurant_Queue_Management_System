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
import AdminChatbotPage from "./pages/adminChatbotPage";
import UserSeatPage from "./pages/userSeatPage";
import AdminVoucherPage from "./pages/adminVoucherPage";
import AdminVoucherManagePage from "./pages/adminVoucherManagePage";
import StaffTablePage from "./pages/staffTablePage";
import StaffTableManagePage from "./pages/staffTableManagePage";
import UserVoucherPage from "./pages/userVoucherPage";
import UserPersonalVoucherPage from "./pages/userPersonalVoucherPage";
import StaffVoucherManagePage from "./pages/staffVoucherManagePage";
import UserGameSelectPage from "./pages/userGameSelectPage";
import UserWaitingGamePage from "./pages/userWaitingGamePage";
import AdminGameSetupPage from "./pages/adminGameSetupPage";
import UserActionGamePage from "./pages/userActionGamePage";
import AdminChatbotManagePage from "./pages/adminChatbotManagePage";
import UserTableStatusPage from "./pages/userTableStatusPage";
import AdminMenuPage from "./pages/adminMenuPage";
import AdminQRcodePage from "./pages/adminQRcodePage";
import UserRestaurantMenuPage from "./pages/userRestaurantMenuPage";
import UserSeatBookingPage from "./pages/userSeatBookingPage";
import UserBookSeatPage from "./pages/userBookSeatPage";
import UserWaitSeatPage from "./pages/userWaitSeatPage";
import StaffWaitingTimePage from "./pages/staffWaitingTimePage";
import UserQueueChangePage from "./pages/userQueueChangePage";
import StaffSeatUserChangePage from "./pages/staffSeatUserChangePage";
import UserBookingPages from "./pages/userBookingPage";
import { useState } from "react";
import { UserContext } from "./context/userContext";
import io from "socket.io-client";
import makeToast from "./toast";

function App() {
  //socket useState below
  const [socket, setSocket] = useState(null);
  const [inQueue, setInQueue] = useState(false);
  const [book, setBook] = useState(null);
  const [waitingPoints, setWaitingPoints] = useState(0);
  const [chosenGame, setChosenGame] = useState("wait");
  const [timeWaited, setTimeWaited] = useState(0);
  const [restaurantChatbotMessage, setRestaurantChatbotMessage] = useState([]);
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
        waitingPoints,
        setWaitingPoints,
        chosenGame,
        setChosenGame,
        timeWaited,
        setTimeWaited,
        restaurantChatbotMessage,
        setRestaurantChatbotMessage,
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
                path="/staff/viewTable"
                element={<StaffTablePage></StaffTablePage>}
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
                path="/staff/modifyRestaurantTable/:id"
                element={
                  <StaffTableManagePage managementFunction="modify"></StaffTableManagePage>
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
              <Route
                path="/admin/chatbot"
                element={<AdminChatbotPage></AdminChatbotPage>}
              ></Route>
              <Route
                path="/admin/addChatbotManage/:id"
                element={
                  <AdminChatbotManagePage specificAction="add"></AdminChatbotManagePage>
                }
              ></Route>
              <Route
                path="/admin/modifyChatbotManage/:id"
                element={
                  <AdminChatbotManagePage specificAction="modify"></AdminChatbotManagePage>
                }
              ></Route>
              <Route
                path="/admin/removeChatbotManage/:id"
                element={
                  <AdminChatbotManagePage specificAction="remove"></AdminChatbotManagePage>
                }
              ></Route>
              <Route
                path="/user/seatPage/:tableName"
                element={<UserSeatPage></UserSeatPage>}
              ></Route>
              <Route
                path="/admin/voucher"
                element={<AdminVoucherPage></AdminVoucherPage>}
              ></Route>
              <Route
                path="/admin/adminVoucherModifyPage/:id"
                element={
                  <AdminVoucherManagePage managementFunction="modify"></AdminVoucherManagePage>
                }
              ></Route>
              <Route
                path="/admin/adminVoucherAddPage/:id"
                element={
                  <AdminVoucherManagePage managementFunction="add"></AdminVoucherManagePage>
                }
              ></Route>
              <Route
                path="/admin/adminVoucherRemovePage/:id"
                element={
                  <AdminVoucherManagePage managementFunction="remove"></AdminVoucherManagePage>
                }
              ></Route>
              <Route
                path="/user/vouchersPage/:restaurantId"
                element={
                  <UserVoucherPage voucherAccessType="notqueue"></UserVoucherPage>
                }
              ></Route>
              <Route
                path="/user/voucherPage/:restaurantId"
                element={
                  <UserVoucherPage voucherAccessType="queue"></UserVoucherPage>
                }
              ></Route>
              <Route
                path="/user/personalVouchers/:restaurantId"
                element={
                  <UserPersonalVoucherPage voucherAccessType="notqueue"></UserPersonalVoucherPage>
                }
              ></Route>
              <Route
                path="/user/personalVoucher/:restaurantId"
                element={
                  <UserPersonalVoucherPage voucherAccessType="queue"></UserPersonalVoucherPage>
                }
              ></Route>
              <Route
                path="/staff/customerVoucherManage/:id"
                element={<StaffVoucherManagePage></StaffVoucherManagePage>}
              ></Route>
              <Route
                path="/user/customerGameSelectPage"
                element={<UserGameSelectPage></UserGameSelectPage>}
              ></Route>
              <Route
                path="/user/customerWaitingGame"
                element={<UserWaitingGamePage></UserWaitingGamePage>}
              ></Route>
              <Route
                path="/user/customerActionGame"
                element={<UserActionGamePage></UserActionGamePage>}
              ></Route>
              <Route
                path="/admin/gameSetup"
                element={<AdminGameSetupPage></AdminGameSetupPage>}
              ></Route>
              <Route
                path="/user/tableStatus/:id"
                element={<UserTableStatusPage></UserTableStatusPage>}
              ></Route>
              <Route
                path="/admin/QRcode"
                element={<AdminQRcodePage></AdminQRcodePage>}
              ></Route>
              <Route
                path="/admin/restaurantMenu"
                element={<AdminMenuPage></AdminMenuPage>}
              ></Route>
              <Route
                path="/user/queueRestaurantMenu/:id"
                element={
                  <UserRestaurantMenuPage menuType="queue"></UserRestaurantMenuPage>
                }
              ></Route>
              <Route
                path="/user/restaurantMenu/:id"
                element={
                  <UserRestaurantMenuPage menuType="notqueue"></UserRestaurantMenuPage>
                }
              ></Route>
              <Route
                path="/user/seatBooking"
                element={<UserSeatBookingPage></UserSeatBookingPage>}
              ></Route>
              <Route
                path="/user/seatBookFound/:tableName"
                element={<UserBookSeatPage></UserBookSeatPage>}
              ></Route>
              <Route
                path="/user/seatBookWaiting/:restaurantId"
                element={<UserWaitSeatPage></UserWaitSeatPage>}
              ></Route>
              <Route
                path="/staff/estimationWaitingTime"
                element={<StaffWaitingTimePage></StaffWaitingTimePage>}
              ></Route>
              <Route
                path="/user/queueBookingModification"
                element={<UserQueueChangePage></UserQueueChangePage>}
              ></Route>
              <Route
                path="/staff/staffSeatUserChange/:tableName"
                element={<StaffSeatUserChangePage></StaffSeatUserChangePage>}
              ></Route>
              <Route
                path="/user/selectingSeatBooking"
                element={<UserBookingPages></UserBookingPages>}
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
