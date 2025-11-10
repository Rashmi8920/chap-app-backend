import Conversatation from "../models/conversatation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../SocketiO/server.js";

export const sendMessage = async (req, res) => { 
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; //current looged in user
    let conversatation = await Conversatation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversatation) {
      conversatation = await Conversatation.create({
        members: [senderId, receiverId],
      });
    }
    const newMessage=new Message({
        senderId,
        receiverId,
        message,
    });
    if(newMessage){
        conversatation.messages.push(newMessage._id)
    }
    // await conversatation.save(); // await newMessage.save();
    await Promise.all([conversatation.save(),newMessage.save()]);  // run paralley
    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMessage=async(req,res)=>{
 try {
     const  {id:chatUser}=req.params;
     const senderId=req.user._id//current login user;
     let  conversatation=await Conversatation.findOne({
         members: { $all: [senderId, chatUser] },
     }).populate("messages");
     if(!conversatation){
        return res.status(201).json([]);
     }
    const  message=conversatation.messages
 res.status(201).json(message);
 } catch (error) {
    console.log("Error in get message",error)
    res.status(500).json({error:"internal srerver error"})
 }   
}
