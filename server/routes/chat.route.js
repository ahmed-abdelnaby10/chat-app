import express from 'express'
import { createChatController, deleteChatController, findSpecificChatController, findUserChatsController } from '../controllers/chat/chat.controller.js'
import { authVerification } from '../middlewares/verifyAuth.middleware.js'

const router = express.Router()

router.route('/')
    .post(authVerification, createChatController)

router.route('/:userId')
    .get(authVerification, findUserChatsController)

router.route('/delete/:chatId')
    .delete(authVerification, deleteChatController)

router.route('/find/:firstId/:secondId')
    .get(authVerification, findSpecificChatController);

export default router