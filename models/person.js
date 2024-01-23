import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  hobbies: { type: String, required: true },
});

export default mongoose.model("Person", personSchema);
