const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    voucherInformation: { type: String },
    voucherQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
