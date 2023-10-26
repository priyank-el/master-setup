import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";
const adminHistorySchema = new mongoose.Schema(
  {
    mainUserId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    subUserId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model(AppConstants.MODEL_ADMIN_HISTORY, adminHistorySchema);
