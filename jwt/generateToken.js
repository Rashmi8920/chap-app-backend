import jwt from 'jsonwebtoken';

 const createTokenAndSaveCookie = (userId,res) => {
 const token=jwt.sign({userId},process.env.JWT_TOKEN,{
    expiresIn:'180d'
 })
//  console.log(token ,"token generatre")
 res.cookie("jwt",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:'lax',
    maxAge:180*24*60*60*1000 //180 days
 })
}


export default createTokenAndSaveCookie;
