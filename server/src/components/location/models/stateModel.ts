import mongoose from "mongoose";
import {AppConstants} from "../../../utils/appConstants";

const stateSchema = new mongoose.Schema(
    {
        name: {
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
module.exports = mongoose.model(AppConstants.MODEL_STATE, stateSchema);
