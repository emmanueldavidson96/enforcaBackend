import { RequestHandler, Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user.model";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateVerificationTokenAndSetCookie";
import { AccountType } from "../models/user.model";

interface SignUpBody{
    firstName?:string,
    email?:string,
    password?:string, 
    lastName?:string,
    phoneNumber?:string,
    confirmPassword?:string,
    accountType?:AccountType
}

// Controller to Sign up User
export const SignupHandler:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    const {name, email, password, phoneNumber, confirmPassword,accountType} = request.body;
    try{
        if(!name || !email || !password || !phoneNumber || !confirmPassword || !accountType){
            throw createHttpError(400, "Parameters missing!")
        }
        const existingUser = await userModel.findOne({
            email:email
        }).exec();
        if(existingUser){
            throw createHttpError(409, "Email already exists in the database!");
        } 
        if(confirmPassword !== password){
            throw createHttpError(409, "confirm password!")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await userModel.create({
            name:name,
            email:email,
            password:hashedPassword,
            phoneNumber: phoneNumber,
            confirmPassword:confirmPassword,
            accountType:accountType,
            isTaskEarner:true
        })
        generateTokenAndSetCookie(response, newUser._id);
        response.status(201).json({
            success:true,
            message:"User created and saved!",
            newUser
        })

    }catch(error){
        next(error)
    }
}



//Controller to Login 
export const LoginHandler:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    const {email, password} = request.body;
    try{
        if(!email || !password){
            throw createHttpError(409, "Missing parameters!")
        }
        const user = await userModel.findOne({
            email:email
        })
        if(!user){
            throw createHttpError(409, "Invalid credentials")
        }        
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if(!isPasswordMatched){
            throw createHttpError(409, "Incorrect password")
        }
       const token = generateTokenAndSetCookie(response, user._id);
        user.lastLogin = new Date();
        await user.save()
        response.status(201).json({
            success:true,
            message:"User logged In! ",
            user,
        })
    }catch(error){
        next(error)
    }
}

//Controlller to Get User Profile for Dashboard
export const getUserProfile:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    try{
        const user = await userModel.findById(request.userId).select("-password");
        if(!user){
            throw createHttpError(409, "User not found")
        }
        response.status(201).json({
            success:true,
            message:"User profile details retrieved",
            user
        })
    }
    catch(error){
        next(error)
    }
}

// Get User Information by ID
export const GetUserById:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    const {id} = request.params;
    try{
        const user = await userModel.findById(id).select("-password");
        if(!user){
            throw createHttpError(409, "User with this id not found!");
        }
        response.status(201).json({
            success:true,
            message:"User profile retrieved!",
            user
        })
    }catch(error){
        next(error)
    }
}

//Get All Users within the database
export const GetAllUsers:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    try{
        const users = await userModel.find().select("-password").exec();
        if(!users){
            throw createHttpError(409, "Users not found!")
        }
        response.status(201).json({
            success:true,
            message:"Users retrieved!",
            users
        })
    }catch(error){
        next(error)
    }
}

//Update User Profile
export const UpdateUserHandler:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    try{

    }catch(error){
        next(error)
    }

}


// Logout User
export const LogoutUserHandler:RequestHandler = async (request:Request, response:Response, next:NextFunction) => {
    try{
        response.clearCookie("altbucksToken");
        response.status(201).json({
            success:true,
            message:"User logged out!"
        })
    }catch(error){
        next(error)
    }
}

