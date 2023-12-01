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
  login,
};
