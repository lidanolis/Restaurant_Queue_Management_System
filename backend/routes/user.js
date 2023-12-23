const router = require("express").Router();
const {
  getRestaurants,
  getARestaurant,
  createNewBooking,
  updateNewBooking,
  getBooking,
  getBookingForRestaurant,
  updateTable,
  getACustomer,
  createNewCustomer,
  addVoucherToCustomer,
  updateCustomerVoucher,
  updateCustomerPoints,
} = require("../controller/userController");

router.get("/getRestaurant", getRestaurants);
router.get("/getARestaurant/:id", getARestaurant);
router.get("/getBooking/:id", getBooking);
router.post("/bookTable", createNewBooking);
router.post("/updateTable/:id", updateNewBooking);
router.get("/getBookings/:restaurantId", getBookingForRestaurant);
router.post("/updateRestaurantTable/:id", updateTable);
router.get("/getCustomer/:restaurantId/:userId", getACustomer);
router.post("/createNewCustomer", createNewCustomer);
router.post("/addVoucherToCustomer", addVoucherToCustomer);
router.post("/updateCustomerVoucher", updateCustomerVoucher);
router.post("/updateCustomerPoints", updateCustomerPoints);
module.exports = router;
