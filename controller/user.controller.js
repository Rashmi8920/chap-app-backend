import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import createTokenAndSaveCookie  from '../jwt/generateToken.js';

export const signup=async(req,res)=>{
    //  res.send("signup route working");
    try {
        const {fullname,email,password,confirmPassword}=req.body;
        if(password!==confirmPassword){
            return res.status(400).json({error:"password do not match"})
        }
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({error:"user already exist"})
        }
        //hasked password
        const hash=await bcrypt.hash(password,10)
    const newUser= new User({
        fullname,
        email,
        password:hash
    });
  await newUser.save()
  if(newUser){
    createTokenAndSaveCookie(newUser._id,res);
    res.status(201).json({message:"user registered successfully",
    user:{
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email
    },
    })
  }
    } catch (error) {
        res.status(500).json({error:"internal server error"})   
         console.error("Signup error:", error.message);
    }
}

export const login=async(req,res)=>{
    // res.send("login route working");
     const {email,password}=req.body
    try {
       
        const user=await User.findOne({email})
        const isMatched=await bcrypt.compare(password,user.password)
        if(!isMatched){
            return res.status(400).json({error:"invalid credentials"})
        }
        if(!user){
            return res.status(400).json({error:"user not found, please signup"})
        }
        createTokenAndSaveCookie(user._id,res);
        res.status(200).json({message:"login successful",user:{
            _id:user._id,
            fullname:user.fullname,
            email:user.email
        }})
    } catch (error) {
        res.status(500).json({error:"internal server error"})   
    }
}

export const logout=async(req,res)=>{
try {
    res.clearCookie("jwt");
    res.status(200).json({message:"logout successful"});
} catch (error) {
    res.status(500).json({error:"internal server error"})   
  console.log(error)
}
}
//login user show bcz of middlearew
export const allUsers=async(req,res)=>{
    try {
        const loggedInUser=req.user._id;
    const filterUsers = await User.find({
        _id:{$ne:loggedInUser},
    }).select("-password");
       res.status(200).json({message:"all users fetched successfully",filterUsers})
    } catch (error) {
        res.status(500).json({error:"error fetching users"})
    }
}