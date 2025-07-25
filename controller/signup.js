import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFile = path.join(__dirname, '..', 'teachers.json');

export  async function signupUser(req,res){
     const { userName, Email, password, mobile, role} = req.body;

     let users= [];
     try{
     const data = await fs.readFile(userFile,'utf8');
     users = JSON.parse(data);
     }catch(err){
        if(err.code!='ENOENT'){ // ager file missing hai to use empty array ki tra treat krega ENOENT
            return res.status(500).json({message: "server read errror"});
        }
     }
     //yha dublication check kraga
     const email = (Email || '').toLowerCase();
     const ifExist = users.find(u => u.Email?.toLowerCase() === email);
     if(ifExist){
        return res.status(409).json({message:"User already exists"});
     }
     
    const newUser = { userName, Email: email, password, mobile, role };
     users.push(newUser);
    
     try{
     await fs.writeFile(userFile,JSON.stringify(users,null,2));
     }catch(err){
     return res.status(500).json({message: "error while reading file!"});
     }
     return res.status(200).json({ message: 'signup success!' });
}
export default signupUser;

