import locationController from "./locationController";

export default [
    {
        path: "/addState",
        method: "post",
        controller: locationController.addStates,
        isPublic: true,
        isEncrypt: false,
    },
    {
        path: "/getStates",
        method: "get",
        controller: locationController.getStates,
        isPublic: true,
        isEncrypt: false,
    },
    {
        path: "/getCities",
        method: "get",
        controller: locationController.getCities,
        isPublic: true,
        isEncrypt: false,
    },
    {
        path: "/getAreas",
        method: "get",
        controller: locationController.getAreas,
        isPublic: true,
        isEncrypt: false,
    },
    {
        path: "/addArea",
        method: "post",
        controller: locationController.addArea,
        isPublic: true,
        isEncrypt: false,
    },

];
