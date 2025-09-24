import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {User} from '../model/User.js';
// const userFile = path.join(__dirname,'..','teachers.json');

export async function loginUser(req,res){
    const { Email, password, role } = req.body;
   
   //  let users=[];
    try{
         // const data = await fs.readFile(userFile,'utf8');
         // users = JSON.parse(data);
         const user = await User.findOne({Email});
         if(!user){
            return res.status(404).json({message:'user not found'});
         }
         if(user.password!==password){return res.status(401).json({message:'Incorrect password'})};
         if(user.role !== role){return res.status(403).json({message:'unauthorised role'})};
         req.session.isauthenticated = true;
         req.session.email = user.Email;
         req.session.role = user.role;
         req.session.userName= user.userName;
         res.status(200).json({
            message:'login succesful',
            role:user.role
      });
    }catch(err){
       return res.status(500).json({ message: 'server read errror' });
    }
   }
    // yha dublication check hova gi
   //   const email = (Email || '')?.toLowerCase();
   //   const ifExist = users.find( f => f.Email?.toLowerCase() === email &&
   //      f.password === password && f.role === role)
   //   if(ifExist){
   //      req.session.isauthenticated = true;
   //      return res.status(200).json({ message: 'login success!',role:ifExist.role,Email:ifExist.Email});
   //   }else{
   //      return res.status(401).json({message: 'user not found'});
   //   }

 export default loginUser;