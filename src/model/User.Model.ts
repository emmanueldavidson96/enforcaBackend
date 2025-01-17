import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    // accountType:{type:String,
    //     default:"Seeker",
    //     enum: ['Seeker', 'Company'],
    // },
    // role:{type:String,
    //     default:"Seeker",
    //     enum: ['User', 'Admin'],
    // },

},{timestamps:true})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel