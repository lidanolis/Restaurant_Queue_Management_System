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
        inOut: "out",
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
  const json = await User.findOneAndUpdate(
    { _id: id },
    { ...req.body, inOut: "in" }
  );
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

const updateInOutStatus = async (req, res) => {
  const { id } = req.params;
  const { inOut } = req.body;
  console.log("modified In Out Status-" + id + "-" + inOut);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("error id");
    return res.status(500).json({ mssg: "error" });
  }
  const json = await User.findOneAndUpdate({ _id: id }, { inOut: inOut });
  if (!json) {
    console.log("error here");
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const staffRemove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(500).json({ mssg: "error" });
    }

    const removeStaff = await Staff.findOneAndDelete({ userId: id });
    if (!removeStaff) {
      res.status(500).json({ mssg: "Invalid Staff Removal" });
    } else {
      const removeStaffFromUser = await User.findOneAndDelete({ _id: id });
      if (!removeStaffFromUser) {
        res.status(500).json({ mssg: "Invalid Staff Removal" });
      } else {
        res.status(200).json(removeStaffFromUser);
      }
    }
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

module.exports = {
  register,
  login,
  profile,
  getProfile,
  updateInOutStatus,
  staffRemove,
};
