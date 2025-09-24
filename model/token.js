import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    email:{type: String,required:true},
    password:{type:String,required:true},
    
})

export const Token = mongoose.model('Token',tokenSchema);