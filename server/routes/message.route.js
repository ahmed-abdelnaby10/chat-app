import express from 'express'
import { CreateMessageController, deleteMessageController, editMessageController, getMessagesController, reactToMessageController } from '../controllers/chat/message.controller.js'
import { authVerification } from '../middlewares/verifyAuth.middleware.js'

const router = express.Router()

router.route('/')
    .post(authVerification, CreateMessageController)

router.route('/:chatId')
    .get(authVerification, getMessagesController)

router.route('/:messageId')
    .patch(authVerification, editMessageController)
    .delete(authVerification, deleteMessageController)

router.route('/reaction/:messageId')
    .patch(authVerification, reactToMessageController)

export default router