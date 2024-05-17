const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

app.listen(PORT, () => console.log("server listening on port " + PORT));

require("./registerUser");
const User = mongoose.model("userInfo");
app.post("/register", async (req, res) => {
  const { name, email, lastname, password } = req.body;
  const encryptPaswd = await bcrypt.hash(password, 10);

  try {
    //we deal with the a unique user here
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.send({ error: "User already exists" });
      return;
    }
    //Create the user
    await User.create({
      name,
      email,
      lastname,
      password: encryptPaswd,
    });
    res.send({ status: "Successfully Registered" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    res.json({ error: "User Not Found" });
    return;
  }
  if (await bcrypt.compare(password, findUser.password)) {
    const token = jwt.sign(
      {
        email: findUser.email,
      },
      process.env.JWT_SECRET
    );

    if (res.status(201)) {
      res.json({ status: "LogIn Success", data: token });
      return;
    } else {
      res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid credentials" });
});

app.post("/userDetails", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userMail = user.email;
    user.findOne({ email: userMail }).then((data) => {
      res.send({ status: "ok", data: data }).catch((error) => {
        res.send({ status: "error", data: "error" });
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// app.post('/save', async (req, res) => {
//   const { name } = req.body
//   try {
//     if (name === "Max") {
//       res.send({ status: "Great" })
//     } else {
//       res.send({ status: "not found" })
//     }

//   } catch (error) {
//     res.send({ status: "Something went wrong" })
//   }

// })

// app.get('/', async (req, res) => {

// })
