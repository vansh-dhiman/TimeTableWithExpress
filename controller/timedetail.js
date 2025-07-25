import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFile = path.join(__dirname,'..','teachers.json');


export async function uploadTimedetail(req,res) {
    res.sendFile(path.join(__dirname,'..','public','timedetail.html'));
}

export async function uploadFormOptions(req,res){

    try{
        const data = await fs.readFile(userFile,'utf8');
        const teachers = JSON.parse(data);
        res.json(teachers);
    }catch(err){
        console.error('error reading teachers.json',err);
        res.status(500).json({ error :'server error'});
    }
}

export async function saveTimeTable(req, res) {
  try {
    const { lecture, subject, starttime, endtime, room, day, selectedTeacher } = req.body;
    if (!lecture || !subject || !starttime || !endtime || !room || !day || !selectedTeacher) {
      return res.status(400).json({ message: "Missing data" });
    }

    // File read
    const data = await fs.readFile(userFile, 'utf8');
    const teachers = JSON.parse(data);

    // Find teacher by Email
    const teacher = teachers.find(t => t.Email === selectedTeacher );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Agar teacher ke paas timetable array nahi hai to create karo
    if (!teacher.timetable) teacher.timetable = [];

    // Add new entry
    teacher.timetable.push({ lecture, subject, starttime, endtime, room, day });

    // File save
    await fs.writeFile(userFile, JSON.stringify(teachers, null, 2), 'utf8');

    res.json({ message: "Timetable saved successfully" });
  } catch (err) {
    console.error("Error saving timetable:", err);
    res.status(500).json({ message: "Server error" });
  }
}