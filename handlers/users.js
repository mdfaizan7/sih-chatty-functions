const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const { validateSignUpData, validateLoginData } = require("../util/validators");

// sign up
exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // Validation
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  let userId, token;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: `This handle is already taken` });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
          })
          .then(idToken => {
            token = idToken;

            const userCredentials = {
              handle: newUser.handle,
              email: newUser.email,
              createdAt: new Date().toISOString(),
              imageURL: `imageURL`,
              userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
          })
          .then(() => {
            return res.status(201).json({ token });
          })
          .catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
              return res.status(400).json({ email: "Email is already in use" });
            }
            return res
              .status(500)
              .json({ general: "Something went wrong, please try again" });
          });
      }
    });
};

// login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => res.json({ token }))
    .catch(err => {
      console.error(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

