import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Leave } from '../model/Leave.js';

export function inboxPage(req,res){
    
    res.sendFile(path.join(__dirname,'..','public','inbox.html'));
}

export async function getUserLeaves(req, res) {
  try {
    console.log(req.session.email);
    
    const email = req.session.email;
    if (!email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find all leaves with leaveId == email
    const leaves = await Leave.find({ email: email });

    res.json(leaves);
  } catch (err) {
    console.error('Error fetching user leaves:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}












// fzwa lmsr nkxe odjg
