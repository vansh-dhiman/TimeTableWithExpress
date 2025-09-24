import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  lecture: { type: Number, required: true },
  subject: { type: String, required: true },
  starttime: { type: String, required: true },
  endtime: { type: String, required: true },
  room: { type: String, required: true }
});

const lectureSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  timetable: {
    type: [timetableSchema],
    default: [] //  default value added
  }
});

export const Lecture = mongoose.model('Lecture', lectureSchema);
