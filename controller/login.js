import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFile = path.join(__dirname,'..','teachers.json');

export async function loginUser(req,res){
    const { Email, password, role } = req.body;
   
    let users=[];
    try{
         const data = await fs.readFile(userFile,'utf8');
         users = JSON.parse(data);
    }catch(err){
        if(err.code!='ENOENT'){ // ager file missing hai to use empty array ki tra treat krega ENOENT
            console.log('read error:',err)
            return res.status(500).json({ message: 'server read errror' });
        }
    }
    // yha dublication check hova gi
     const email = (Email || '')?.toLowerCase();
     const ifExist = users.find( f => f.Email?.toLowerCase() === email &&
        f.password === password && f.role === role)
     if(ifExist){
        req.session.isauthenticated = true;
        return res.status(200).json({ message: 'login success!',role:ifExist.role,Email:ifExist.Email});
     }else{
        return res.status(401).json({message: 'user not found'});
     }
}
export default loginUser;