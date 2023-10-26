import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const loginSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: false,
  },
  fromTime: {
    type: String,
    required: false,
    default: null,
  },
  toTime: {
    type: String,
    required: false,
    default: null,
  },
  loginStatus: {
    type: Number,
    required: false,
    default: null,
    comment: "1 is activeNow",
  },
  ipAddress: {
    type: String,
    required: false,
  },
});

const loginDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    activeStatus: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is deactive 1 active",
    },
    loginSessions: [loginSessionSchema]
  },
  { timestamps: true }
);
module.exports = mongoose.model(AppConstants.MODEL_LOGIN_DETAIL, loginDetailSchema);
