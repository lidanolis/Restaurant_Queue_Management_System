const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userVoucherSchema = new Schema(
  {
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Voucher",
    },
    voucherQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const customerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    userPoints: { type: Number, default: 0 },
    userVouchers: [userVoucherSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
