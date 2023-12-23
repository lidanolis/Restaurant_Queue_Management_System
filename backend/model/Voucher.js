const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    voucherInformation: { type: String },
    pointsRequired: { type: Number },
    voucherAcquireMethod: { type: String },
    voucherDuration: { type: Number },
    durationType: { type: String },
    voucherStatus: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
