import express from "express";
// import verifyToken from "../middleware/authMiddleware.js";
import Person from "../models/person.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/add-person", async (req, res) => {
  try {
    const person = new Person(req.body);
    const result = await person.save();
    res.send(result);
  } catch (error) {
    console.error("Error adding person:", error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the person" });
  }
});

router.get("/people", async (req, res) => {
  try {
    const people = await Person.find({});
    if (people.length > 0) {
      res.send(people);
    } else {
      res.send({ result: "No People found" });
    }
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).send({ error: "An error occurred while fetching people" });
  }
});

router.delete("/person/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Deleting person with id:", id);

  try {
    const deletionResult = await Person.deleteOne({ _id: id });

    if (deletionResult.deletedCount > 0) {
      res.send({ result: "Person deleted successfully" });
    } else {
      res.send({ result: "Person not found" });
    }
  } catch (error) {
    console.error("Error deleting person:", error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the person" });
  }
});

router.get("/person/:id", async (req, res) => {
  let result = await Person.findOne({ _id: req.params.id });

  if (result) {
    res.send(result);
  } else {
    res.send({
      result: "No record found",
    });
  }
});

router.put("/person/:id", async (req, res) => {
  let result = await Person.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

router.get("/search/:key", async (req, res) => {
  try {
    const key = req.params.key;

    const result = await Person.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { email: { $regex: key, $options: "i" } },
        { hobbies: { $regex: key, $options: "i" } },
      ],
    });

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const selectedPeople = req.body.selectedPeople;

    if (!selectedPeople || selectedPeople.length === 0) {
      console.log("No selected data to send.");
      return res.status(400).send("No selected data to send.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: process.env.EMAIL_TO,
      subject: "Selected Data from CRUD Application",
      text: `Selected Data:\n${JSON.stringify(selectedPeople, null, 2)}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
