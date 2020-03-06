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

app.post("/conversation", FBAuth, createConv);
app.get("/conversation", FBAuth, getConversations);
app.get("/conversation/:ConvId", getConversation);

app.post("/signup", signUp);
app.post("/login", login);

app.post("/message/:ConvId", FBAuth, postMessage);

exports.api = functions.https.onRequest(app);
