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
      res.status(500).json({ mssg: "Email Already In Use" });
    }
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.params;
    const getStaff = await User.findOne({ email: email, password: password });
    if (!getStaff) {
      res.status(500).json({ mssg: "Invalid Login" });
    } else {
      res.status(200).json(getStaff);
    }
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const profile = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("error id");
    return res.status(500).json({ mssg: "error" });
  }
  const json = await User.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!json) {
    console.log("error here");
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const getProfile = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await User.findOne({ _id: id });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

module.exports = {
  register,
  login,
  profile,
  getProfile,
};
