'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const userModel = new schema({
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
  }
},
{
  versionKey: false
});

userModel.pre('save', next => {
  let now = new Date();
  const datav = new Date(moment().add(7, 'days')._d.toIsoString());
  
  if(!this.createdAt) this.createdAt = now;
  if(!this.payDay) this.createdAt = datav;

  next()
});

module.exports = mongoose.model('User', userModel);