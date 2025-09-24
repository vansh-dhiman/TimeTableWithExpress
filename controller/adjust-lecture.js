import fs from 'fs/promises';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Lecture } from '../model/Lecture.js';
import { Leave } from '../model/Leave.js';
import { User } from '../model/User.js';
import { constrainedMemory } from 'process';
import { rejects } from 'assert';
import { time } from 'console';
import { approveLeave } from './leavepage.js';
import { adjustment } from '../model/adjustment.js'; // adjust path if needed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function getadjustmentpage(req,res) { 
   res.render('adjust-lecture');
}
export async function getLecture(req,res) {
   console.log(req.query,"ooooooooooo")
   const teacherid = req.query.teacherid;
   console.log(teacherid);
   try {
      const userDoc = await User.find();

      const leaveDoc = await Leave.findOne({_id:teacherid});
      console.log(leaveDoc,"ppp");
      
      const email = leaveDoc.email;
      const lectureDoc = await Lecture.findOne({Email:email});
      if(!lectureDoc&&!userDoc){
         console.log('file not found');
         res.status(404).json({message:'file not found'});
      }
      console.log('data sent');
      res.status(200).json({
         timetable:lectureDoc.timetable,
         leaveEmail:email,
         userDoc:userDoc
      });
   }catch(err){
         console.log(err);
   }
}

export async function checkTeacherAvailable(req, res) {
  const { checkTeacherAvailable, checkDay, checklecture, checkDate } = req.body;

  try {
    // Check leave status
    const leaveDoc = await Leave.find({
      email: checkTeacherAvailable,
      status: 'Approved',
      fromDate: { $lte: new Date(checkDate) },
      toDate: { $gte: new Date(checkDate) }
    });

    if (leaveDoc.length > 0) {
      return res.status(200).json({ message: 'not available' });
    }

    // Check for conflicting lecture
    const lectureDoc = await Lecture.findOne({ Email: checkTeacherAvailable });
    if (lectureDoc) {
      const timetable = lectureDoc.timetable || [];
      const conflict = timetable.find(
        lec => lec.day === checkDay && String(lec.lecture) === String(checklecture)
      );
      if (conflict) {
        return res.status(200).json({ message: 'not available' });
      }
    }

    return res.status(200).json({ message: 'available' });
  } catch (err) {
    console.error('Server error in checkTeacherAvailable:', err);
    return res.status(500).json({ message: 'internal error' });
  }
}


export async function sendRequestToTeacher(req, res) {
  try {
    const { email, day, lectureNo, subject, lectureTime, room } = req.body;
    console.log(req.body);
    const adj = new adjustment({
  email,
  day,
  lectureNo,
  subject,
  lectureTime,
  room
});
await adj.save();

    // await newAdjustment.save();
    res.status(200).json({ message: "Request saved successfully" });
  } catch (err) {
    console.error("Error saving adjustment request:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// export async function checkTeacherAvailable(req,res) {
//    const { checkTeacherAvailable,checkDay,checklecture } = req.body;
//    console.log(checkTeacherAvailable,checkDay,checklecture,'checking availability');
//    try{
//       const leaveDoc = await Leave.find({
//           email: checkTeacherAvailable,
//          status:'Approved',
//          fromDate:{ $lte: new Date() },
//          toDate:{ $gte: new Date()},  
//          });
//         if(leaveDoc.length > 0){
//          return res.status(200).json({ message: 'not available'});
//         }

//         const lectureDoc = await Lecture.findOne({ Email:checkTeacherAvailable });
        
//         if(lectureDoc){
//         const timetable = lectureDoc.timetable || [];
//       //   for(let i=0;i<timetable.length-1;i++){
//       //      if(checkDay == timetable[i].day && checklecture == timetable[i].lecture) 
//       //       {
//       //          return res.status(200).json({message:'not available'});
//       //       }else{
//       //          return res.status(404).json({message:'available'});
//       //       }        
//       //    }
//       const conflict = timetable.find(
//          lec => lec.day === checkDay && String(lec.lecture) === String(checklecture)
//       );

//       if(conflict){
//          return res.status(200).json({message:'not available'});
//       }
//        }

//        return res.status(200).json({ message: 'available' });

//    }catch(err){
//          console.error('Server error in checkTeacherAvailable:',err);
//     return res.status(500).json({ message: 'internal error' });
//    }
// }
// // const promise = new promise((resolve,rejected)=>{
// //    const file = fs.readFile('leaves.json','utf8',(err,data)=>{
// //       if(err){
// //          reject(err);
// //       }
// //       resolve(data);
// //    });
// // });

// // promise
// // .then((res)=>{
// //    console.log('data',data);
// // })
// // .catch((err)=>{
// //    console.log('error',err);
// // })