import { ConnectedUser } from "../components/socket/connectedUser";

const config = require("config")

export const AppConstants = {
    "API_ROUTE_SOCKET": "",
    "USER_IMAGE_PATH": config.get("ROUTE_URL") + "/uploads/images/",

    "MODEL_USER": 'User',
    "MODEL_ADMIN": 'Admin',
    "MODEL_TOKEN": 'Token',
    "MODEL_STATE": "State",
    "MODEL_CITY": "City",
    "MODEL_AREA": "AreaCodes",
    "MODEL_LOGIN_DETAIL": 'LoginDetails',
    "MODEL_ADMIN_HISTORY": 'AdminHistory',

    "TOKEN_EXPIRY_TIME": '10m',
    "DATE_FORMAT": "yyyy-MM-DD HH:mm:ss.SSS",
    "DATE_FORMAT_SHORT": "yyyy-MM-DD HH:mm:ss",

    "MODEL_PERMISSION": "Permission",
    "MODEL_ROLE_HAS_PERMISSION": "RoleHasPermission",
    "MODEL_ROLE": "Role",
}

export class SocketAppConstants {
    public static connectedUsers: { [key: string]: string } = {};
    public static userMap: { [userKey: string]: ConnectedUser } = {}
}
declare global {
    interface String {
        isExists(): boolean;
        isEmpty(): boolean;
    }

    interface Number {
        isExists(): boolean;
    }

    interface Boolean {
        isExists(): boolean;
    }
}

String.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}
String.prototype.isEmpty = function () {
    return (this) == "";
}

Number.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}

Boolean.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}