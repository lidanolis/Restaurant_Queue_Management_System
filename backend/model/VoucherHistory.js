const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherHistorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Voucher",
    },
    recordType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VoucherHistory", voucherHistorySchema);
