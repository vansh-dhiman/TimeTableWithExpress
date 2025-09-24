import { Leave } from '../model/Leave.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import { Leave } from '../model/Leave.js';

export async function leavepage(req,res) {
    res.sendFile(path.join(__dirname,'..','public','leavepage.html'));
}

export async function getPendingLeaves(req, res) {
    
  try {
    const leaves = await Leave.find({ status: 'PENDING' });
    console.log(leaves);
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leaves:', err);
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
}

export async function approveLeave(req, res) {
  try {
    const { id } = req.body;
    console.log(id);
    await Leave.updateOne({ _id:id }, { $set: { status: 'Approved' } });
    res.json({ 
      message: 'Leave approved',
      status:'Approved' });
  } catch (err) {
    console.error('Error approving leave:', err);
    res.status(500).json({ error: 'Approval failed' });
  }
}

export async function rejectLeave(req, res) {
  try {
    const { id } = req.body;
    await Leave.updateOne({ _id:id }, { $set: { status: 'Rejected' } });
    res.json({ message: 'Leave rejected' });
  } catch (err) {
    console.error('Error rejecting leave:', err);
    res.status(500).json({ error: 'Rejection failed' });
  }
}
