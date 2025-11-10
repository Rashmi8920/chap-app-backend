import express from 'express'
import { getMessage, sendMessage } from '../controller/message.controller.js';
import secureRoute from '../middlware/secureroute.js'

const router=express.Router();
router.post("/send/:id",secureRoute,sendMessage)
router.get("/get/:id",secureRoute,getMessage)

export default router;