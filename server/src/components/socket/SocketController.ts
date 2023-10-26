import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { SocketAppConstants } from "../../utils/appConstants";
import { ConnectedUser } from "./connectedUser";
const User = require("../user/models/userModel");

export const connectionHandler = async (io: Server, client: Socket) => {
  let userId = client.handshake.query["userId"]?.toString() ?? "0";
  let randomString = client.handshake.query["randomString"]?.toString() ?? "0";

  let clientId = client.id;
  console.log("connectd", userId);
  if (userId && userId != "0") {
    SocketAppConstants.connectedUsers[clientId] = userId;
    SocketAppConstants.userMap[userId] = new ConnectedUser(userId, clientId);
  } else if (randomString && randomString != "0") {
    SocketAppConstants.connectedUsers[randomString] = randomString;
    SocketAppConstants.userMap[randomString] = new ConnectedUser(
      randomString,
      randomString
    );
  } else {
    return false;
  }

  client.on("changesStatusLink", async (data) => {
    console.log("changesStatusLink", data);
    const userId = data.userId;
    const socket_id = SocketAppConstants.userMap[userId.toString()]?.socket_id;
    if (socket_id) {
      io.sockets.sockets.get(socket_id).emit("status_change", {
        status: data.status,
        linkId: data.changesStatusLink,
      });
    }

    // client.join(randomString);
  });
  client.on("store_flag", async (data) => {
    const userIds = Object.keys(SocketAppConstants.userMap);
    userIds.forEach((el) => {
      const socket_id = SocketAppConstants.userMap[el.toString()]?.socket_id;
      if (socket_id) {
        console.log(socket_id);
        io.sockets.sockets.get(socket_id).emit("store_flag");
      }
    });
  });
  /**
   * @description: when server disconnects from user
   */
  client.on("disconnect", async function () {
    console.log("DISCONNECT");

    let userId = SocketAppConstants.connectedUsers[client.id];
    let connectedUser: ConnectedUser = SocketAppConstants.userMap[userId];
    delete SocketAppConstants.connectedUsers[client.id];

    if (
      userId != undefined &&
      connectedUser &&
      clientId == connectedUser.socket_id
    ) {
      if (SocketAppConstants.userMap[userId]?.socket_id == client.id) {
        delete SocketAppConstants.userMap[userId];
      }
    }

    client.disconnect(true);
  });
};
