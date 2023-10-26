import mongoose from "mongoose";
import {AppConstants} from "../../../utils/appConstants";

const areaCodeSchema = new mongoose.Schema(
    {
        area_name: {
            type: String,
            default: null,
        },
        area_code: {
            type: Number,
            default: null,
        },
    },
    {timestamps: true}
);
module.exports = mongoose.model(AppConstants.MODEL_AREA, areaCodeSchema);
