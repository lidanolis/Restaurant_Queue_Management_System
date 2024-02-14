const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantTableSchema = new Schema({
  tableName: { type: String, required: true },
  tableQuantity: { type: Number, required: true },
  tableStatus: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const chatbotSequenceSchema = new Schema({
  questionPair: { type: String, required: true },
  answerPair: { type: String, required: true },
  pathPair: { type: String, required: true },
  usePair: { type: Boolean, required: true },
});

const restaurantSchema = new Schema(
  {
    restaurantName: { type: String, required: true },
    restaurantDescription: { type: String },
    restaurantTable: [restaurantTableSchema],
    chatbotSequence: [chatbotSequenceSchema],
    waitingGameTimeRequired: { type: Number },
    waitingGameTimeType: { type: String },
    waitingGamePointsGiven: { type: Number },
    actionGamePointsGiven: { type: Number },
    restaurantStatus: { type: String },
    estimatedWaitTime: { type: Number },
    estimatedWaitTimeFormat: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
