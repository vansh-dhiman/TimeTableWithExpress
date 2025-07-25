import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashRouter = express.Router();

export function uploadDashboard(req,res){
    
    res.sendFile(path.join(__dirname,'..','public','dashboard.html'));
}
export default dashRouter;