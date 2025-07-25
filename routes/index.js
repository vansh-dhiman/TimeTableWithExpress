import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { uploadLogin } from './login.js';
import { uploadSignup } from './signup.js';
import { uploadDashboard } from './dashboard.js';
import signupUser from '../controller/signup.js';
import loginUser from '../controller/login.js';
import { uploadOptions } from '../controller/dashboard.js';
import { uploadFormOptions, uploadTimedetail } from '../controller/timedetail.js';
import { saveTimeTable } from '../controller/timedetail.js';
import { uploadteacherpage } from '../controller/teacherpage.js';
import { readteacherFile } from '../controller/teacherpage.js';
import { isAuthenticated } from '../middleware/auth.js';

const pageRoutes = express.Router();

pageRoutes.get('/login',uploadLogin);
pageRoutes.get('/signup',uploadSignup);

pageRoutes.post('/signup/user',signupUser);
pageRoutes.post('/login/user',loginUser);

pageRoutes.get('/dashboard',isAuthenticated, uploadDashboard);
pageRoutes.get('/dashboard/teacherOptions',isAuthenticated, uploadOptions);
pageRoutes.get('/timedetail',isAuthenticated, uploadTimedetail);
pageRoutes.get('/timedetail/teacherOptions',isAuthenticated, uploadFormOptions);
pageRoutes.post('/timedetail/save',isAuthenticated, saveTimeTable);
pageRoutes.get('/teacherpage',isAuthenticated, uploadteacherpage);
pageRoutes.get('/teacherpage/teacherdata',isAuthenticated, readteacherFile);

export default pageRoutes;