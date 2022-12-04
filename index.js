const express = require("express");
const app = express();
const port = 7070;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.use(express.static(__dirname + "/public"));

app.get("/signinsubmit", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  db.collection("users")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("web");
      } else {
        res.send("<h1>Login failed ,incorrect login credentials</h1>");
      }
    });
});

app.get("/signupsubmit", (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const password = req.query.password;
  db.collection("users")
    .add({
      name: firstname + lastname,
      email: email,
      password: password,
    })
    .then(() => {
      res.render("signin");
    });
});

app.get("/navsubmit", (req, res) => {
  res.render("signin");
});

app.get("/navsubmit", (req, res) => {
  res.render("signup");
});

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/web", (req, res) => {
  res.render("web");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.ejs"));
});

app.listen(port, () => {
  console.log(`Server is running on Port Number: http://localhost:${port}`);
});
