const { db } = require("../util/admin");

exports.postMessage = (req, res) => {
  const newMessage = {
    ConvId: `${req.params.ConvId}`,
    message: req.body.message,
    author: req.user.handle,
    time: new Date().toISOString()
  };

  db.collection("Messages")
    .add(newMessage)
    .then(doc => {
      const resMessage = newMessage;
      resMessage.messageId = doc.id;
      res.json(resMessage);
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
