import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { uploadLogin } from './login.js';
import { uploadSignup } from './signup.js';
import { uploadDashboard } from './dashboard.js';
import {signupUser} from '../controller/signup.js';
import loginUser from '../controller/login.js';
import { uploadOptions, getusername} from '../controller/dashboard.js';
import { uploadTimedetail } from '../controller/timedetail.js';
import { saveTimeTable } from '../controller/timedetail.js';
import { RequestedLeave, uploadteacherpage} from '../controller/teacherpage.js';
import { readteacherFile } from '../controller/teacherpage.js';
import { dataForTable } from '../controller/dashboard.js';
import { isAuthenticated } from '../middleware/auth.js';
import { inboxPage , getUserLeaves } from '../controller/inbox.js';
import {getPendingLeaves,approveLeave,rejectLeave, leavepage} from '../controller/leavepage.js';

import { getadjustmentpage,getLecture,checkTeacherAvailable } from '../controller/adjust-lecture.js';
import { getteacher_chatpage,getadminmessage } from '../controller/teacher-chat.js';
import { logout } from '../middleware/auth.js';
import { sendRequestToTeacher } from '../controller/adjust-lecture.js'; 
import { getadminchatpage } from '../controller/admin-chat.js'
import { sendTeachermsg } from '../controller/teacher-chat.js';
import { getlist } from '../controller/admin-chat.js'
import { addAdjustment } from '../controller/admin-chat.js'
import { getforgotpage,checkuservalid,generatetoken,resetpassword} from '../controller/forgot.js';

const pageRoutes = express.Router();

pageRoutes.get('/login',uploadLogin);
pageRoutes.get('/logout',logout);
// pageRoutes.get('/logout',logoutteacher);
pageRoutes.get('/signup',uploadSignup);

pageRoutes.post('/signup/user',signupUser);
pageRoutes.post('/login/user',loginUser);
pageRoutes.get('/dashboard',isAuthenticated, uploadDashboard);
pageRoutes.get('/dashboard/teacherOptions',isAuthenticated, uploadOptions);
pageRoutes.get('/timedetail',isAuthenticated, uploadTimedetail);
// pageRoutes.get('/timedetail/teacherOptions',isAuthenticated, uploadFormOptions);
pageRoutes.post('/timedetail/save',isAuthenticated, saveTimeTable);
pageRoutes.get('/teacherpage',isAuthenticated, uploadteacherpage);
pageRoutes.post('/teacherdata',isAuthenticated, readteacherFile);
pageRoutes.post('/submitLeave',isAuthenticated,RequestedLeave);
// pageRoutes.post('/leaveRequests',getPendingLeaveRequests);
// pageRoutes.post('/statusAprove',approveLeave);
// pageRoutes.post('/checkleavestatus',checkleavestatus);
// pageRoutes.post('/statusReject',rejectLeave);
// pageRoutes.post('/readeFileForAdjustment',lectureAdjustment);
pageRoutes.get('/datafortable',isAuthenticated,dataForTable);
pageRoutes.get('/inbox',isAuthenticated,inboxPage);
pageRoutes.get('/myLeaveRequests',isAuthenticated,getUserLeaves);
pageRoutes.post('/getloginEmail',isAuthenticated,getusername);
pageRoutes.get('/leavepage',isAuthenticated,leavepage);
pageRoutes.get('/leaveRequests',isAuthenticated, getPendingLeaves);
pageRoutes.post('/statusAprove',isAuthenticated, approveLeave);
pageRoutes.post('/statusReject',isAuthenticated, rejectLeave);

pageRoutes.get('/adjustment',isAuthenticated,getadjustmentpage);
pageRoutes.get('/getLectures',isAuthenticated,getLecture);

pageRoutes.post('/checkTeacherAvailable',isAuthenticated,checkTeacherAvailable);
pageRoutes.get('/getteacher_chatpage',isAuthenticated,getteacher_chatpage);
pageRoutes.post('/senddataTOteacher', isAuthenticated,sendRequestToTeacher);
pageRoutes.get('/adminchat',isAuthenticated,getadminchatpage);
pageRoutes.get('/getadminmessage',isAuthenticated,getadminmessage);
pageRoutes.post('/sendTeachermsg', isAuthenticated, sendTeachermsg);
pageRoutes.get('/getlist',isAuthenticated,getlist);
pageRoutes.post('/addAdjustment',isAuthenticated,addAdjustment);

pageRoutes.get('/forgot',getforgotpage);
pageRoutes.post('/checkuservalid',checkuservalid);
pageRoutes.post('/generatetoken',generatetoken);
pageRoutes.post('/resetpassword',resetpassword);

export default pageRoutes;