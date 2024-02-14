const router = require("express").Router();
const {
  createRestaurant,
  setStaffRestaurant,
  getRestaurant,
  getRestaurantWithRestaurantId,
  addTableToRestaurant,
  updateTable,
  removeTable,
  getVoucherList,
  getAVoucher,
  addVoucherToRestaurant,
  updateVoucher,
  removeVoucher,
  updateRestaurantGame,
  addChatbotMessage,
  modifyChatbotMessage,
  removeChatbotMessage,
  addRestaurantImage,
  getRestaurantMenu,
  removeRestaurantMenu,
  updateRestaurantWaitingTime,
  updateRestaurantOnOff,
  getStaffList,
} = require("../controller/staffController");

router.post("/createRestaurant", createRestaurant);
router.post("/setStaff", setStaffRestaurant);
router.get("/getStaff/:id", getRestaurant);
router.get("/getRestaurant/:id", getRestaurantWithRestaurantId);
router.post("/addTable/:id", addTableToRestaurant);
router.post("/updateTable/:id", updateTable);
router.post("/removeTable/:id", removeTable);
router.get("/getVoucher/:restaurantId", getVoucherList);
router.get("/getAVoucher/:id", getAVoucher);
router.post("/addVoucher", addVoucherToRestaurant);
router.post("/updateVoucher/:id", updateVoucher);
router.post("/removeVoucher/:id", removeVoucher);
router.post("/updateGame/:id", updateRestaurantGame);
router.post("/addChatbotMessage/:id", addChatbotMessage);
router.post("/modifyChatbotMessage/:id", modifyChatbotMessage);
router.post("/removeChatbotMessage/:id", removeChatbotMessage);
router.post("/addRestaurantImage", addRestaurantImage);
router.get("/getRestaurantMenu/:restaurantId", getRestaurantMenu);
router.get("/removeRestaurantMenu/:id", removeRestaurantMenu);
router.post("/updateRestaurantWaitingTime/:id", updateRestaurantWaitingTime);
router.post("/updateRestaurantStatus", updateRestaurantOnOff);
router.get("/getRestaurantStaffList/:restaurantId", getStaffList);

module.exports = router;
