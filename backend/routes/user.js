const router = require("express").Router();
const {
  getRestaurants,
  getARestaurant,
  createNewBooking,
  updateNewBooking,
  getBooking,
} = require("../controller/userController");

router.get("/getRestaurant", getRestaurants);
router.get("/getARestaurant/:id", getARestaurant);
router.get("/getBooking/:id", getBooking);
router.post("/bookTable", createNewBooking);
router.post("/updateTable/:id", updateNewBooking);
module.exports = router;
