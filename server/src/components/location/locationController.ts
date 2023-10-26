import { Request, Response } from "express";
import { AppStrings } from "../../utils/appStrings";
import commonUtils from "../../utils/commonUtils";
import stateData from "../../../services/states.json";
import cityData from "../../../services/cities.json";
import areaData from "../../../services/area.json";

const State = require("./models/stateModel");
const City = require("./models/cityModel");
const Area = require("./models/areaModel");

async function addStates(req: Request, res: Response) {
  try {
    // await Promise.all(stateData.map(async (state) => {
    //     // Insert state
    //     const newState = new State({
    //         name: state.state_name,
    //         latitude: Number(state.latitude),
    //         longitude: Number(state.longitude),
    //     });
    //     await newState.save();

    //     // find all cities and insert in db
    //     let cities = cityData.filter((city) => city.state_id == state.state_id);
    //     await City.insertMany(cities.map((city) => {
    //         return {
    //             state_id: newState._id,
    //             name: city.city_name,
    //             state_code: city.state_code,
    //             latitude: Number(city.latitude),
    //             longitude: Number(city.longitude),
    //         }
    //     }));
    // }));

    // return commonUtils.sendSuccess(req, res, {message: AppStrings.ALL_STATE}, 200);
    return commonUtils.sendSuccess(
      req,
      res,
      { message: "Sorry, permission denied!" },
      200
    );
  } catch (err) {
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function getStates(req: Request, res: Response) {
  try {
    const states = await State.find().sort("name");
    return commonUtils.sendSuccess(req, res, states, 200);
  } catch (err) {
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function getCities(req: Request, res: Response) {
  try {
    let pipeline: any = [
      {
        $lookup: {
          from: "states",
          localField: "state_id",
          foreignField: "_id",
          as: "stateData",
        },
      },
      { $unwind: { path: "$stateData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          stateName: "$stateData.name",
          state_code: "$state_code",
        },
      },
      { $sort: { name: 1 } },
    ];
    const cities = await City.aggregate(pipeline);
    return commonUtils.sendSuccess(req, res, cities, 200);
  } catch (err) {
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function getAreas(req: Request, res: Response) {
  try {
    const areas = await Area.find().sort("area_code");
    return commonUtils.sendSuccess(req, res, areas, 200);
  } catch (err) {
    return commonUtils.sendError(req, res, {
      message: AppStrings.SOMETHING_WENT_WRONG,
    });
  }
}

async function addArea(req: Request, res: Response) {
  try {
    // await Promise.all(areaData.map(async (area: any) => {
    //     // Insert Area
    //     const newArea = new Area({
    //         area_name: area.area_name,
    //         area_code: area.area_code,
    //     });
    //     await newArea.save();
    // }));

    // If the insertion was successful, return a success message with a 200 status code
    return commonUtils.sendSuccess(
      req,
      res,
      { message: "Area data added successfully." },
      200
    );
  } catch (err) {
    console.error(err); // Log the error for debugging purposes

    // Return an error message with an appropriate status code
    return commonUtils.sendError(req, res, {
      message: "Failed to add area data. Please try again later.",
    });
  }
}

export default {
  addStates,
  getStates,
  getCities,
  getAreas,
  addArea
};
