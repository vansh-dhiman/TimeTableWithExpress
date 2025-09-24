import path from "path";
import { fileURLToPath } from 'url';
import { User } from '../model/User.js';
import { Lecture } from '../model/Lecture.js';
import { Token } from "../model/token.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getforgotpage(req,res) {
    res.sendFile(path.join(__dirname,'..','public','forgot.html'));
}

export async function checkuservalid(req,res) {
    const { emailInput } = req.body;
    try{
        const userDoc = await User.findOne({Email:emailInput});
        if(!userDoc){
            console.log('user not found');
            return res.status(404).json({message:'user not found'});
        }
        return res.status(200).json({message:'user valid'});
    }catch(err){
        console.log('server error');
        return res.status(500).json({message:'server error'});
    }
}

export async function generatetoken(req,res) {
    const { emailInput } = req.body;
    try{
        const newtoken = Math.random().toString(36).substr(2, 10);
        const expiryTime = Date.now() + 5 * 60 * 1000;
        
        let userDoc = await User.findOne({Email:emailInput});
        if(!userDoc){
            res.status(404).json({message:'user not found'});
        }
        
        userDoc.resetToken = newtoken;
        userDoc.tokenExpiry = expiryTime;
        await userDoc.save(); 
        console.log('token saved:',newtoken);
        
       const mailsent = await sendMail(newtoken,emailInput);
       if(!mailsent){
               return res.status(500).json({message:'fafiled to send mail'});
       }
        return res.status(200).json({
            message:'Token generated successfully',
            token:newtoken
        });
        
    }catch(err){
        console.log('server error',err);
        return res.status(500).json({message: 'server error'});
    }
}

 async function sendMail(token,emailInput) {
    try{
        //pehle transporter create kro 
        const transporter = nodemailer.createTransport({
            service:'gmail', // gmail ke liye 
            auth:{
                user:'vanshmehle004@gmail.com', // apni gmail daldi 
                pass:'vlpy uipn zlbb lfuw', // jo gmail pa te generate krya tha passs key
            }
        });

        // define mail options
        let mailOptions = {
            from: '"fzwa_lmsr_nkxe_odjg" <vanshmehle004@gmail.com>',
            to:emailInput,
            subject:'password reset link',
            text: `Use this token to reset your password: ${token}`,
            html:`<p>Use this token to reset your password: <b>${token}</b></p>`,
        }
        // send mail
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    }catch(err){
        console.log('server error',err);
        return false;
    }
}


export async function resetpassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        // Step 1: Find user by resetToken
        const userDoc = await User.findOne({ resetToken: token });

        if (!userDoc) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Step 2: Check token expiry
        if (Date.now() > userDoc.tokenExpiry) {
            return res.status(400).json({ message: 'Token expired' });
        }

        // Step 3: Hash new password
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Step 4: Save new password & clear token fields
        // userDoc.Password = hashedPassword;
        userDoc.password = newPassword;
        userDoc.resetToken = undefined;
        userDoc.tokenExpiry = undefined;
        await userDoc.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (err) {
        console.log('server error', err);
        return res.status(500).json({ message: 'server error' });
    }
}
