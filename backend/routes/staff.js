const router = require("express").Router();
const {
  createRestaurant,
  setStaffRestaurant,
  getRestaurant,
  getRestaurantWithRestaurantId,
  addTableToRestaurant,
  updateTable,
  removeTable,
} = require("../controller/staffController");

router.post("/createRestaurant", createRestaurant);
router.post("/setStaff", setStaffRestaurant);
router.get("/getStaff/:id", getRestaurant);
router.get("/getRestaurant/:id", getRestaurantWithRestaurantId);
router.post("/addTable/:id", addTableToRestaurant);
router.post("/updateTable/:id", updateTable);
router.post("/removeTable/:id", removeTable);

module.exports = router;
