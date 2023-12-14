const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantTableSchema = new Schema({
  tableName: { type: String, required: true },
  tableQuantity: { type: Number, required: true },
  tableStatus: { type: String, required: true },
});

const chatbotSequenceSchema = new Schema({
  questionPair: { type: String, required: true },
  answerPair: { type: String, required: true },
  pathPair: { type: String, required: true },
});

const restaurantSchema = new Schema(
  {
    restaurantName: { type: String, required: true },
    restaurantDescription: { type: String },
    restaurantTable: [restaurantTableSchema],
    chatbotSequence: [chatbotSequenceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
