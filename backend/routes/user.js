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
  getRestaurantMenu,
  updateBookingQuantity,
  checkAllRestaurantSeats,
  getBookingForUser,
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
router.get("/getRestaurantMenu/:restaurantId", getRestaurantMenu);
router.post("/updateBookingQuantity/:id", updateBookingQuantity);
router.get("/checkRestaurantSeats/:userId", checkAllRestaurantSeats);
router.get("/getAllCustomerBookings/:id", getBookingForUser);

module.exports = router;
