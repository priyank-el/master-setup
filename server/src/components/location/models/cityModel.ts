import mongoose from "mongoose";
import {AppConstants} from "../../../utils/appConstants";

const citySchema = new mongoose.Schema(
    {
        state_id: {
            type: mongoose.Types.ObjectId,
            reference: "states",
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        state_code: {
            type: String,
            default: null,
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
    },
    {timestamps: true}
);
module.exports = mongoose.model(AppConstants.MODEL_CITY, citySchema);
