import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const signupRouter = express.Router();//------


export function uploadSignup(req,res){
    res.sendFile(path.join(__dirname,'..','public','signup.html'));
}

export default signupRouter;

