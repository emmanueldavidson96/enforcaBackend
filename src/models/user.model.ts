import mongoose from "mongoose";

export enum AccountType{
    Company= "company",
    Seeker = "seeker",
}
export enum Role {
    Admin = "admin",
    User = "user"
}

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
    accountType:{
        type:String,
        enum:Object.values(AccountType),
        default:AccountType.Seeker
    },
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.User
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
    application:[{type:mongoose.Schema.Types.ObjectId, ref:"Application"}],
    job:[{type:mongoose.Schema.Types.ObjectId, ref:"Job"}],
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
}, {
    timestamps:true
})

export default mongoose.model("User", userSchema)