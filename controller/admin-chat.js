import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../model/User.js';
import { Lecture } from '../model/Lecture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getadminchatpage(req, res) {
    res.sendFile(path.join(__dirname,'..','public','admin-chat.html'));
}

export async function getlist(req,res) {
    try{
          const list = await User.find({},{Email: 1,userName: 1, _id: 0 });
          if(list.length === 0){
                return res.status(404).json({message:'not found'})
          }
          return res.status(200).json(list);
          
    }catch(err){
        console.log('server error',err);
        return res.status(500).json({message: 'server error'});
    }
}

export async function addAdjustment(req, res) {
    try {
        const { Email, day, lecture, subject, room , lecturetime} = req.body;

        let [starttime,endtime] = lecturetime.split('-');
        console.log('starttime',starttime);
        console.log('endtime',endtime);
        const emailLower = (Email || "").toLowerCase();

        if (!emailLower) {
            return res.status(400).json({ message: "Email is required" });
        }

        let teacher = await Lecture.findOne({ Email: emailLower });
        if (!teacher) {
            teacher = new Lecture({ Email: emailLower, timetable: [] });
        }

        teacher.timetable.push({ lecture, subject, room, day , starttime ,endtime });

        await teacher.save();
        console.log("Saved document:", teacher);
        return res.status(200).json({ message: "Adjustment saved successfully" });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}
