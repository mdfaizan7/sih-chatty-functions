const { db } = require("../util/admin");

// get all conversations realted to the authenticated user
exports.getConversations = (req, res) => {
  db.collection("Conversation")
    .orderBy("time", "desc")
    .get()
    .then(data => {
      let Convs = [];
      data.forEach(doc => {
        if (
          req.user.handle === doc.data().creator ||
          req.user.handle === doc.data().createdWith
        ) {
          Convs.push({
            ConvId: doc.id,
            creator: doc.data().creator,
            time: new Date().toISOString(),
            ConvName: doc.data().ConvName,
            createdWith: doc.data().createdWith
          });
        }
      });
      return res.json(Convs);
    })
    .catch(err => console.error(err));
};

// create a conversation
exports.createConv = (req, res) => {
  const newConv = {
    creator: req.user.handle,
    time: new Date().toISOString(),
    ConvName: req.body.ConvName,
    createdWith: req.body.createdWith
  };

  db.collection("Conversation")
    .add(newConv)
    .then(doc => {
      const resConv = newConv;
      resConv.ConvId = doc.id;
      res.json(resConv);
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// fetch a conversation
exports.getConversation = (req, res) => {
  let ConvData = {};

  db.doc(`/Conversation/${req.params.ConvId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      ConvData = doc.data();
      ConvData.ConvId = doc.id;

      return db
        .collection("Messages")
        .orderBy("time")
        .where("ConvId", "==", req.params.ConvId)
        .get();
    })
    .then(data => {
      ConvData.messages = [];
      data.forEach(doc => {
        ConvData.messages.push(doc.data());
      });
      return res.json(ConvData);
    })
    .catch(err => {
      console.error(err);
      return status(500).json({ error: err.code });
    });
};
