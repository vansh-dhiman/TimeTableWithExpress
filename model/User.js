import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{type:String,required:true},
    Email : {type: String, unique:true,required:true},
    mobile:{type: String,required:true},
    password : {type: String,required:true},
    role : {type: String,role:['admin','teacher'],required:true},
    resetToken:{type:String},
    tokenExpiry:{type:Date}
})

export const User  = mongoose.model("User", userSchema);