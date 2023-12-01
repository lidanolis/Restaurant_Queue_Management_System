const router = require("express").Router();
const { login } = require("../controller/mainController");

router.get("/login", login);

module.exports = router;
