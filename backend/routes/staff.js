const router = require("express").Router();
const { register, login } = require("../controller/staffController");

router.get("/login", login);
router.post("/register", register);

module.exports = router;
