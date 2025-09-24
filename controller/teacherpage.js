import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Lecture } from '../model/Lecture.js';
import { User } from '../model/User.js';
import { Leave } from '../model/Leave.js';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { copyFileSync } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const userFile = path.join(__dirname,'..','teachers.json');

export async function uploadteacherpage(req,res) {
        // res.sendFile(path.join(__dirname,'..','public','teacherpage.html'));
        const loginEmail = req.session.email;
        const UserDoc = await User.findOne({ Email: loginEmail });
        res.render("teacherpage",{userName:UserDoc.userName})
}
export async function readteacherFile(req, res) {
  // const { loginEmail } = req.body;
  const loginEmail = req.session.email;
  try {
    if (!loginEmail) {
      return res.status(400).json({ error: 'loginEmail is required' });
    }

    const LectureDoc = await Lecture.findOne({ Email: loginEmail });
    if (!LectureDoc) {
      return res.status(404).json({ error: 'No timetable found for this email' });
    }

    const UserDoc = await User.findOne({ Email: loginEmail });
    if (!UserDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      timetable: LectureDoc.timetable,
      // userName: UserDoc.userName,
      loginEmail: loginEmail
    });

  } catch (err) {
    console.error('Error reading teacher data:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// const userLeaveFile = path.join(__dirname,'..','leaves.json');
export async function RequestedLeave(req, res) {
  
  const data = req.body.formData;
  console.log(data)
  if (!data.email || !data.fromDate || !data.toDate || !data.reason || !data.status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newLeave = new Leave({
      email:data.email,
      fromDate:data.fromDate,
      toDate:data.toDate,
      reason:data.reason,
      status:"PENDING",
    });

    await newLeave.save();
    return res.status(200).json({ message: 'Leave request submitted' });

  } catch (err) {
    console.error('Error saving leave request:', err);
    return res.status(500).json({ message: 'Server error while saving leave' });
  }
}

    

