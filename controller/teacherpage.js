import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFile = path.join(__dirname,'..','teachers.json');

export async function uploadteacherpage(req,res) {
        res.sendFile(path.join(__dirname,'..','public','teacherpage.html'));
}
export async function readteacherFile(req,res) {
    try{
            const data = await fs.readFile(userFile,'utf8');
            const teachers = JSON.parse(data);
            res.json(teachers);
        }catch(err){
            console.error('error reading teachers.json',err);
            res.status(500).json({ error :'server error'});
        }
}

export async function RequestedLeave(req,res) {
    try{
          
    }catch(err){

    }
}