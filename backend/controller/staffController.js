const mongoose = require("mongoose");
const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Staff = require("../model/Staff");
const Voucher = require("../model/Voucher");
const RestaurantImage = require("../model/RestaurantImage");
const getAVoucher = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const result = await Voucher.findOne({
    _id: id,
  });

  if (!result) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(result);
};

const getVoucherList = async (req, res) => {
  const { restaurantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(500).json({ mssg: "error" });
  }
  const result = await Voucher.find({
    restaurantId: restaurantId,
  });

  if (!result) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(result);
};

const createRestaurant = async (req, res) => {
  const { restaurantName, restaurantDescription } = req.body;
  try {
    const newRestaurant = await Restaurant.create({
      restaurantName: restaurantName,
      restaurantDescription: restaurantDescription,
      restaurantTable: [],
      chatbotSequence: [],
      waitingGameTimeRequired: 1,
      waitingGameTimeType: "minute",
      waitingGamePointsGiven: 1,
      actionGamePointsGiven: 1,
      restaurantStatus: "open",
      estimatedWaitTimeInMinutes: 5,
      estimatedWaitTimeFormat: "minute",
    });
    res.status(200).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const setStaffRestaurant = async (req, res) => {
  const { userId, restaurantId } = req.body;
  try {
    const newStaff = await Staff.create({
      userId: userId,
      restaurantId: restaurantId,
    });
    res.status(200).json(newStaff);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const getRestaurant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Staff.findOne({ userId: id });
  if (!json) {
    return res.status(500).json({ mssg: "error" });
  }
  return res.status(200).json(json);
};

const getRestaurantWithRestaurantId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("error");
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Restaurant.findOne({ _id: id });
  if (!json) {
    console.log("nothing");
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const addTableToRestaurant = async (req, res) => {
  const { id } = req.params;
  const { tableName, tableQuantity, tableStatus } = req.body;
  const newTableObject = {
    tableName,
    tableQuantity,
    tableStatus,
    userId: null,
  };
  console.log("new table object " + newTableObject);
  try {
    // Find the restaurant by ID and update the restaurantTable array
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      { $push: { restaurantTable: newTableObject } },
      { new: true } // Return the updated document
    );

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error adding table to restaurant:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateTable = async (req, res) => {
  const { id } = req.params;
  const { tableName, tableQuantity, tableStatus, userId } = req.body;
  const updatedTable = {
    tableName,
    tableQuantity,
    tableStatus,
    userId,
  };

  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        "restaurantTable.tableName": tableName,
      },
      {
        $set: {
          "restaurantTable.$": updatedTable,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      console.log("Restaurant or table not found");
      return res.status(500).json({ mssg: "error" });
    }

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating table:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const removeTable = async (req, res) => {
  const { id } = req.params;
  const { tableName } = req.body;
  console.log("id: " + id);
  console.log("table Name: " + tableName);
  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      { $pull: { restaurantTable: { tableName: tableName } } },
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      console.log("Restaurant not found");
      return res.status(500).json({ mssg: "Restaurant not found" });
    }

    console.log("Table removed successfully");
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error removing table:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const addVoucherToRestaurant = async (req, res) => {
  const {
    restaurantId,
    voucherInformation,
    pointsRequired,
    voucherAcquireMethod,
    voucherDuration,
    durationType,
    voucherStatus,
  } = req.body;
  try {
    const newVoucher = await Voucher.create({
      restaurantId: restaurantId,
      voucherInformation: voucherInformation,
      pointsRequired: pointsRequired,
      voucherAcquireMethod: voucherAcquireMethod,
      voucherDuration: voucherDuration,
      durationType: durationType,
      voucherStatus: voucherStatus,
    });
    res.status(200).json(newVoucher);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const updateVoucher = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedVoucher = await Voucher.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { ...req.body },
      },
      { new: true } // Return the updated document
    );

    if (!updatedVoucher) {
      console.log("Voucher not found");
      return res.status(500).json({ mssg: "error" });
    }
    return res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error("Error updating Voucher:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const removeVoucher = async (req, res) => {
  const { id } = req.params;
  console.log("id: " + id);
  try {
    const removeVoucher = await Voucher.findOneAndUpdate(
      { _id: id },
      {
        $set: { voucherStatus: "remove" },
      }
    );

    if (!removeVoucher) {
      console.log("Voucher not found");
      return res.status(404).json({ mssg: "Voucher not found" });
    }

    console.log("Voucher removed successfully");
    return res.status(200).json(removeVoucher);
  } catch (error) {
    console.error("Error removing voucher:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateRestaurantGame = async (req, res) => {
  const { id } = req.params;
  const {
    actionGamePointsGiven,
    waitingGameTimeRequired,
    waitingGameTimeType,
    waitingGamePointsGiven,
  } = req.body;
  try {
    // Find the restaurant by ID and update the restaurantTable array
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          actionGamePointsGiven: actionGamePointsGiven,
          waitingGameTimeRequired: waitingGameTimeRequired,
          waitingGameTimeType: waitingGameTimeType,
          waitingGamePointsGiven: waitingGamePointsGiven,
        },
      },
      { new: true } // Return the updated document
    );

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating game Setup to restaurant:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const addChatbotMessage = async (req, res) => {
  const { id } = req.params;
  const { questionPair, answerPair, pathPair, usePair } = req.body;
  const newMessageObject = {
    questionPair: questionPair,
    answerPair: answerPair,
    pathPair: pathPair,
    usePair: usePair,
  };
  try {
    const newChatbotMessage = await Restaurant.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: { chatbotSequence: newMessageObject },
      },
      { new: true } // Return the updated document
    );

    if (!newChatbotMessage) {
      console.log("unable to add chatbot message");
      return res.status(500).json({ mssg: "error" });
    }
    return res.status(200).json(newChatbotMessage);
  } catch (error) {
    console.error("Error adding Chatbot Message:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const modifyChatbotMessage = async (req, res) => {
  const { id } = req.params;
  const { questionPair, answerPair, pathPair, usePair, chatbotId } = req.body;
  const newMessageObject = {
    questionPair: questionPair,
    answerPair: answerPair,
    pathPair: pathPair,
    usePair: usePair,
  };
  try {
    const newChatbotMessage = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        "chatbotSequence._id": chatbotId,
      },
      {
        $set: { "chatbotSequence.$": newMessageObject },
      },
      { new: true } // Return the updated document
    );

    if (!newChatbotMessage) {
      console.log("unable to add chatbot message");
      return res.status(500).json({ mssg: "error" });
    }
    return res.status(200).json(newChatbotMessage);
  } catch (error) {
    console.error("Error adding Chatbot Message:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const removeChatbotMessage = async (req, res) => {
  const { id } = req.params;
  const { chatbotId } = req.body;
  try {
    const newChatbotMessage = await Restaurant.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $pull: { chatbotSequence: { _id: chatbotId } },
      },
      { new: true } // Return the updated document
    );

    if (!newChatbotMessage) {
      console.log("unable to add chatbot message");
      return res.status(500).json({ mssg: "error" });
    }
    return res.status(200).json(newChatbotMessage);
  } catch (error) {
    console.error("Error adding Chatbot Message:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const addRestaurantImage = async (req, res) => {
  const { restaurantId, stringType, imageString } = req.body;
  try {
    const newImage = await RestaurantImage.create({
      restaurantId: restaurantId,
      imageString: imageString,
      stringType: stringType,
    });
    res.status(200).json(newImage);
  } catch (err) {
    res.status(500).json({ mssg: err });
  }
};

const getRestaurantMenu = async (req, res) => {
  const { restaurantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await RestaurantImage.find({
    restaurantId: restaurantId,
    stringType: "menu",
  });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const removeRestaurantMenu = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await RestaurantImage.findOneAndDelete({
    _id: id,
  });
  if (!json) {
    res.status(500).json({ mssg: "error" });
  }
  res.status(200).json(json);
};

const updateRestaurantWaitingTime = async (req, res) => {
  const { id } = req.params;
  const { estimatedWaitTime, estimatedWaitTimeFormat } = req.body;
  try {
    // Find the restaurant by ID and update the restaurant wait time
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          estimatedWaitTime: estimatedWaitTime,
          estimatedWaitTimeFormat: estimatedWaitTimeFormat,
        },
      },
      { new: true } // Return the updated document
    );

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating wait time to restaurant:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const updateRestaurantOnOff = async (req, res) => {
  const { restaurantId, onOffStatus } = req.body;
  try {
    // Find the restaurant by ID and update the restaurantTable array
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: restaurantId },
      {
        $set: {
          restaurantStatus: onOffStatus ? "open" : "closed",
        },
      },
      { new: true } // Return the updated document
    );

    console.log("Updated Restaurant:", updatedRestaurant);
    return res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    return res.status(500).json({ mssg: "error" });
  }
};

const getStaffList = async (req, res) => {
  const { restaurantId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(500).json({ mssg: "error" });
  }
  const json = await Staff.find({ restaurantId: restaurantId });
  if (!json) {
    return res.status(500).json({ mssg: "error" });
  }
  return res.status(200).json(json);
};

module.exports = {
  createRestaurant,
  setStaffRestaurant,
  getRestaurant,
  getRestaurantWithRestaurantId,
  addTableToRestaurant,
  updateTable,
  removeTable,
  getVoucherList,
  getAVoucher,
  addVoucherToRestaurant,
  updateVoucher,
  removeVoucher,
  updateRestaurantGame,
  addChatbotMessage,
  modifyChatbotMessage,
  removeChatbotMessage,
  addRestaurantImage,
  getRestaurantMenu,
  removeRestaurantMenu,
  updateRestaurantWaitingTime,
  updateRestaurantOnOff,
  getStaffList,
};
