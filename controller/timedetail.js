import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Lecture } from '../model/Lecture.js';
import { User } from '../model/User.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const userFile = path.join(__dirname,'..','teachers.json');


export async function uploadTimedetail(req,res) {
    res.sendFile(path.join(__dirname,'..','public','timedetail.html'));
}

export async function uploadFormOptions(req,res){

    try{
        // const data = await fs.readFile(userFile,'utf8');
        // const teachers = JSON.parse(data);
        const data = await User.find();
       return res.status(200).json(data);
    }catch(err){
        console.error('error reading teachers.json',err);
        res.status(500).json({ error :'server error'});
    }
}

export async function saveTimeTable(req, res) {
  const { lecture, subject, starttime, endtime, room, day, selectedTeacher } = req.body;
   console.log(selectedTeacher);
  try {
    // if (!lecture || !subject || !starttime || !endtime || !room || !day || !selectedTeacher) {
    //   return res.status(400).json({ message: "Missing data" });
    // }
    // File read
    // const data = await fs.readFile(userFile, 'utf8');
    // const teachers = JSON.parse(data);
      // const users = await Lecture.findOne({selectedTeacher});
      // if(!users){
      //   return res.status(404).json({message:'lecture document not found'});
      // }
      const teacher = await Lecture.findOne({Email:selectedTeacher.toLowerCase()});
      if(!teacher){
        return res.status(404).json({message:'teacher not found'});
      }
      if(!teacher.timetable) teacher.timetable = [];
      teacher.timetable.push({lecture,subject,starttime,endtime,room,day});
      await teacher.save();
      return res.status(200).json({message:'timetable saved successfully'});
    // Find teacher by Email
    // const teacher = teachers.find(t => t.Email === selectedTeacher );
    // if (!teacher) {
      // return res.status(404).json({ message: "Teacher not found" });
    }catch(err){
          console.error("Error saving timetable:", err);
         return res.status(500).json({message:'server error'});
    }

    // Agar teacher ke paas timetable array nahi hai to create karo
    // if (!teacher.timetable) teacher.timetable = [];

    // Add new entry
    // teacher.timetable.push({ lecture, subject, starttime, endtime, room, day });

// File saveQAAQ
    // await fs.writeFile(userFile, JSON.stringify(teachers, null, 2), 'utf8');

  //   res.json({ message: "Timetable saved successfully" });
  // } catch (err) {
  //   console.error("Error saving timetable:", err);
  //   res.status(500).json({ message: "Server error" });
  // }
}