// model/Leave.js
import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  email: { type: String, required: true},
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
});

export const Leave = mongoose.model('Leave', leaveSchema);
