const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const transactionModel = new Schema(
  {
    transaction_id: { type: String },
    status: { type: String },
    authorization_code: { type: String },
    risk_level: { type: String },
    acquirer_id: { type: String },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    cardId: {
      type: ObjectId,
      ref: "Card",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

transactionModel.pre("save", (next) => {
  const now = new Date();

  if (!this.createdAt) this.createdAt = now;

  next();
});

module.exports = mongoose.model("Transaction", transactionModel);
