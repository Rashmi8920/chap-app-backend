import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'

const secureRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        // console.log(token,"seuretoken")
        if(!token){
            return res.status(401).json({error:"No token,unauthorized access, please login"})
        }
        const decoded=jwt.verify(token,process.env.JWT_TOKEN);
        if(!decoded){
            return res.status(401).json({error:"invalid token"})
        }
       const user=await User.findById(decoded.userId).select('-password');//current login user
       if(!user){
        return res.status(401).json({error:"user not found, unauthorized access, please login"})
       }
       req.user=user;
        next();
    } catch (error) {
        console.log("error in secureRoute",error)
        res.status(500).json({error:"internal server error"});
    }
}
export default secureRoute;