const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const userModel = new Schema(
  {
    name: {
      trim: true,
      index: true,
      required: true,
      type: String,
    },
    email: { type: String },
    password: { type: String },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    payDay: {
      type: Date,
      default: Date.now,
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

userModel.pre("save", (next) => {
  const now = new Date();
  // eslint-disable-next-line no-underscore-dangle
  const datav = new Date(moment().add(7, "days")._d.toISOString());

  if (!this.createdAt) this.createdAt = now;
  if (!this.payDay) this.createdAt = datav;

  next();
});

module.exports = mongoose.model("User", userModel);
