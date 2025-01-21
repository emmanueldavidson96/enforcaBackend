import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:String,
        default:false
    },
    userImageUrl:{
        type:String,
    },
    cloudinary_id:{
        type:String,
    },
    userDescription:{
        type:String
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    socketIds: {
      type: [String], // Array of socket IDs for handling multiple devices
      default: [],
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
}, {
    timestamps:true
})

export default mongoose.model("User", userSchema)