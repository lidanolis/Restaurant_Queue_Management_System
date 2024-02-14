const router = require("express").Router();
const {
  register,
  login,
  profile,
  getProfile,
  updateInOutStatus,
  staffRemove,
} = require("../controller/mainController");

router.get("/login/:email/:password", login);
router.post("/register", register);
router.post("/profile/:id", profile);
router.get("/profile/:id", getProfile);
router.post("/updateInOut/:id", updateInOutStatus);
router.get("/staffRemoval/:id", staffRemove);

module.exports = router;
