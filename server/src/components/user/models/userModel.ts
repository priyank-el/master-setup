import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";
import { UserType } from "../../../utils/enum";
const userSchema = new mongoose.Schema(
  {
    mainUserId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    firstName: {
      type: String,
      require: true,
      default: null,
    },
    lastName: {
      type: String,
      require: true,
      default: null,
    },
    companyName: {
      type: String,
      require: true,
      default: null,
    },
    mcNumber: {
      type: String,
      require: true,
      default: null,
    },
    dotNumber: {
      type: String,
      require: true,
      default: null,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    alternativeMobile: {
      type: String,
      require: false,
      default: "",
    },
    mobileData: {
      type: Object,
      require: false,
      default: null,
    },
    password: {
      type: String,
      require: true,
      default: null,
    },
    isApprove: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Not Approve 1 is Approve 2 is Rejected",
    },
    // isSubUser: {
    //   type: Number,
    //   required: false,
    //   default: 0,
    //   comment: "0 is No 1 is Yes",
    // },
    isVerified: {
      type: Number,
      required: false,
      default: 0,
      comment: "0 is Pending, 1 is Verify, 2 is Not verify",
    },
    activeStatus: {
      type: Number,
      required: false,
      default: 1,
      comment: "0 is inactive 1 active",
    },
    ext: {
      type: String,
      require: false,
      default: null,
    },
    type: {
      type: Number,
      required: false,
      enum: UserType,
      default: UserType.BROKER,
    },
    makeAdminOtp: {
      type: Number,
      require: false,
      default: null,
    },
    makeAdmin: {
      type: Boolean,
      require: false,
      default: false,
    },
    pushToken: {
      type: String,
      require: true,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model(AppConstants.MODEL_USER, userSchema);
