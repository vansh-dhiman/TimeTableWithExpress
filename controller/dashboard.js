import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../model/User.js';
import { Lecture } from '../model/Lecture.js';
import { Leave } from '../model/Leave.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const userFile = path.join(__dirname,'..','teachers.json');


export async function getusername(req,res){
    try{
        const loginEmail = req.session.email;
 const data = await User.findOne({ Email: loginEmail });
        console.log(data,"oooooooo");
        
        return res.status(200).json({
            loginEmail:loginEmail,
            userName:data.userName
        });
    }catch(err){
        console.error('error reading teachers.json',err);
       return  res.status(500).json({ error :'server error'});
    }
}

export async function uploadOptions(req,res){

    try{
        const teachers = await User.find({role:'teacher'}).select('userName Email');
        return res.status(200).json(teachers);
    }catch(err){
        console.error('error reading teachers.json',err);
       return  res.status(500).json({ error :'server error'});
    }
}
export async function  dataForTable(req,res) {
    try{
         const data = await Lecture.find();
         res.status(200).json(data);
    }catch(err){
         console.error('error while reading file',err);
         return res.status(500).json({error:'server error'});
    }
}
//---------------------
// const userLeaveFile = path.join(__dirname,'..','leaves.json');
// export async function getPendingLeaveRequests (req,res) {
//     try{
//         // const data = await fs.readFile(userLeaveFile,'utf8');
//         // const leaveFile = JSON.parse(data);
//         // return res.status(200).json(leaveFile)
//         const pendingLeaves = await Leave.find({status:"PENDING"});
//         return res.status(200).json(pendingLeaves);
//     }catch(err){
//         console.error('Error reading leave file:', err);
//         res.status(500).json({message:"server error whlile reading file"});
//     }
// } 

// export async function approveLeave(req,res) {
//     const { leaveId }=req.body;
//     try{
//         const data = await fs.readFile(userLeaveFile,'utf8');
//         const leaveFile = JSON.parse(data);
//         const foundIndex = leaveFile.findIndex(l => l.leaveId === leaveId);
//         if(foundIndex == -1){
//           return res.status(404).json({ message: "Leave request not found" });
//         }
//         leaveFile[foundIndex].status = 'APROVED';
//         await fs.writeFile(userLeaveFile,JSON.stringify(leaveFile,null,2));
//         res.status(200).json({message:"Leave approved", leave: leaveFile[foundIndex] })
//     }catch(err){
//         console.log('error reading leave file:',err);
//         res.status(500).json({message:"server error while reading leavefile"});
//     }   
// }

// export async function rejectLeave(req,res) {
//     const {leaveId }=req.body;
//     try{
//         const data = await fs.readFile(userLeaveFile,'utf8');
//         const leaveFile = JSON.parse(data);
//         const index = leaveFile.findIndex(f => f.leaveId === leaveId);
//         if(index === -1){
//             return res.status(404).json({message:'leave id not found'});
//         } 
//         leaveFile[index].status = 'REJECTED';
//         await fs.writeFile(userLeaveFile,JSON.stringify(leaveFile,null,2));
//         return res.status(200).json({message:'Leave rejected',leave:leaveFile[index]});
//     }catch(err){
//         console.log('failed to fetch',err);
//         alert('failed to fetch');
//     }
    
// }

// export async function lectureAdjustment(req,res) {
//     const { leaveId }=req.body;
//     try{
//         const data = fs.readFile(userFile,'utf8');
//         const teachers = JSON.parse(data);

//         const index = teachers.findIndex(i=> i.Email === leaveId);
//         if(index === -1){
//         return res.status(404).json({message:'leave id not found'});
//         }
//         const timetableArray = teachers[index].timetable || [];
//         return res.status(200).json(timetableArray);        
//     }catch(err){
//         console.log('failed to read userfile',err);
//         return res.status(500).json({message:'server error'});
//     }
// }