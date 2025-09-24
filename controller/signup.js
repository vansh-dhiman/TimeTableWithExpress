import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {User} from '../model/User.js';
import { Lecture } from '../model/Lecture.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export  async function signupUser(req,res){
     const { userName, Email, password, mobile, role} = req.body;

     try{
   const exist = await User.findOne({ Email });
   if(exist){
      return res.status(400).json({message:'email already exist'});
   }
   //   }catch(err){
   //      if(err.code!='ENOENT'){ // ager file missing hai to use empty array ki tra treat krega ENOENT
   //          return res.status(500).json({message: "server read errror"});
   //      }
   //   }
     //yha dublication check kraga
   //   const email = (Email || '').toLowerCase();
   //   const ifExist = users.find(u => u.Email?.toLowerCase() === email);
   //   if(ifExist){
   //      return res.status(409).json({message:"User already exists"});
   //   }
     
    const newUser = new User({ userName, Email, password, mobile, role });
   await newUser.save();
   if (role.toLowerCase() === "teacher"){ 
      const newTeacher = new Lecture({
         Email,
      timetable:[]
   });
      await newTeacher.save();
          console.log('Lecture entry created for:', Email);
   }
    return res.status(200).json({message:'signup succesfull',role });
   //   try{
   //   await fs.writeFile(userFile,JSON.stringify(users,null,2));
   //   }catch(err){
   //   return res.status(500).json({message: "error while writing file!"});
   //   }
   //   return res.status(200).json({ message: 'signup success!' });
}catch(err){
       console.error("Signup Error:", err);  // Log actual error in console

   return res.status(500).json({message:'server error!'});  
}
}
// export default signupUser;

