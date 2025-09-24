import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  day: { type: String, required: true },
  lectureNo: { type: String, required: true },
  subject: { type: String, required: true },
  lectureTime: { type: String, required: true },
  room: { type: String, required: true },
  adminmsg: { type: String },
});

// const lectureSchema

export const adjustment = mongoose.model('adjustment', adjustmentSchema);
