const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();

const FBAuth = require("./util/FBAuth");

const {
  getConversations,
  createConv,
  getConversation
} = require("./handlers/conversation");

const { postMessage } = require("./handlers/messages");

const { signUp, login } = require("./handlers/users");

// conversation routes
app.post("/conversation", FBAuth, createConv);
app.get("/conversations", FBAuth, getConversations);
app.get("/conversation/:ConvId", getConversation);

// user routes
app.post("/signup", signUp);
app.post("/login", login);

// message routes
app.post("/message/:ConvId", FBAuth, postMessage);

exports.api = functions.https.onRequest(app);
