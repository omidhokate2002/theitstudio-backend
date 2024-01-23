import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY;

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    jwt.sign({ result }, JWT_KEY, { expiresIn: "24h" }, (error, token) => {
      if (error) {
        res.send({
          result: "Something went wrong, Please try after some time.",
        });
      }
      res.send({ result, auth: token });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .send({ error: "An error occurred while registering the user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      const user = await User.findOne(req.body).select("-password");
      console.log("Logged In User", user);
      if (user) {
        jwt.sign({ user }, JWT_KEY, { expiresIn: "24h" }, (error, token) => {
          if (error) {
            res.send({
              result: "Something went wrong, Please try after some time.",
            });
          }
          res.send({ user, auth: token });
        });
      } else {
        res.send({ result: "User not found." });
      }
    } else {
      res.send({ result: "User not found." });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "An error occurred while logging in" });
  }
});

export default router;
