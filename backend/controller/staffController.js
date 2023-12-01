const mongoose = require("mongoose");
const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Staff = require("../model/Staff");

const register = async (req, res) => {
  const { name, email, password, contact, role } = req.body;
  try {
    const validateEmail = await User.find({ email: email });
    if (validateEmail.length === 0) {
      const newStaff = await User.create({
        name,
        email,
        password,
        contact,
        role,
      });
      res.status(200).json(newStaff);
    } else {
      res.status(200).json({ mssg: "Email Already In Use" });
    }
  } catch (err) {
    res.status(200).json({ mssg: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const getStaff = await User.findOne({ email: email, password: password });
    if (!getStaff) {
      res.status(200).json({ mssg: "Invalid Login" });
    } else {
      res.status(200).json(getStaff);
    }
  } catch (err) {
    res.status(200).json({ mssg: err });
  }
};

module.exports = {
  register,
  login,
};
