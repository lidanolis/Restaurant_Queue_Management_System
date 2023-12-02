const router = require("express").Router();
const {
  register,
  login,
  profile,
  getProfile,
} = require("../controller/mainController");

router.get("/login/:email/:password", login);
router.post("/register", register);
router.post("/profile/:id", profile);
router.get("/profile/:id", getProfile);

module.exports = router;
