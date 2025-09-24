import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { adjustment } from '../model/adjustment.js';
import { User } from '../model/User.js';
import { Lecture } from '../model/Lecture.js';
import { Leave } from '../model/Leave.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getteacher_chatpage(req,res) {
    res.sendFile(path.join(__dirname,'..','public','teacher-chat.html'));
}

   export async function getadminmessage(req, res) {
  const checkemail = req.session.email;

  try {
    const adjustmentdata = await adjustment.find({ email: checkemail }); // use `find()` to get array

    if (!adjustmentdata || adjustmentdata.length === 0) {
      return res.status(404).json({ message: 'No adjustment data found' });
    }

    return res.status(200).json({ adjustmentdata });
  } catch (err) {
    console.error("Error fetching adjustment data:", err);
    return res.status(500).json({ message: 'Server error while fetching adjustment data' });
  }
}

export async function sendTeachermsg(req, res) {
  const { messageInput } = req.body;
  console.log(req.body);
  const checkemail = req.session.email;

  console.log("Received messageInput:", messageInput);
  console.log("From session email:", checkemail);

  try {
    const doc = await adjustment.findOne({ email: checkemail });
     console.log(doc);
    if (!doc) {
      console.log("No adjustment doc found for email:", checkemail);
      return res.status(404).json({ message: 'No adjustment found for this user.' });
    }

    doc.teachermsg = messageInput;
    await doc.save();

    console.log("Saved teacher message:", messageInput);
    return res.status(200).json({ message: 'Teacher message saved successfully.' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
