const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantImageSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    imageString: {
      type: String,
    },
    stringType: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RestaurantImage", restaurantImageSchema);
