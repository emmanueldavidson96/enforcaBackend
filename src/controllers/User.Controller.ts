import { Request, Response } from "express";
const UserModel= require("./model/User.Model.ts");

export const signupUser = async (request:Request, response:Response) => {
    const {email, password, name, phoneNumber} = request.body;

    try{
        const newUser = new UserModel({
            email,
            password,
            name,
            phoneNumber
        })
        await newUser.save()
        response.status(200).json({
            success:true,
            message:"User saved successfully"
        })
    }catch(error){
        response.status(400).json({
            success:false,
            message: "Internal Server Error"
        })
    }

}
