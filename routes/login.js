import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loginRouter = express.Router();

export function uploadLogin(req, res) {
  res.sendFile(path.join(__dirname,'..','public','login.html'));
}
export default loginRouter; 
