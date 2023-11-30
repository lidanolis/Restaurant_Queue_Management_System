const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
    tableName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
