import Message from "../../models/message.model.js";
import User from "../../models/user.model.js";
import Chat from "../../models/chat.model.js";  
import { checkRequiredFields } from "../../utils/checkRequiredFields.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { httpStatus } from "../../utils/httpStatusText.js";

// Create message
export const CreateMessageController = async (req, res) => {
    try {
        const { chatId, senderId, text } = req.body
    
        if (!checkRequiredFields(req, res, ['chatId', 'senderId', 'text'])) {
            return;
        }

        const sender = await User.findById(senderId)
        const chat = await Chat.findById(chatId)

        if (!sender) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "Sender not found!", 404))
        }
        if (!chat) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "Chat not found!", 404))
        }

        const message = new Message({
            chatId,
            senderId,
            text
        })
        
        const newMessage = await message.save()

        return res.status(201).json(formatResponse(httpStatus.SUCCESS, { message: newMessage }, "Message created successfully!", 201))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}

// Get messages
export const getMessagesController = async (req, res) => { 
    try {
        const { chatId } = req.params
        
        const chat = await Chat.findById(chatId)
        
        if (!chat) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "Chat not found!", 404))
        }

        const messages = await Message.find({ chatId });

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { messages: messages }, "Message featched successfully!", 200))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}

// Edit message
export const editMessageController = async (req, res) => { 
    try {
        const { messageId } = req.params
        
        const message = await Message.findById(messageId)

        if (!message) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Message not found!", 404))
        }

        const updatedMessage = await Message.findByIdAndUpdate(messageId, {$set: {
            ...req.body,
            edited: true
        }},
            { new: true }
        )

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { message: updatedMessage }, "Message updated successfully!", 200))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}

// Edit message
export const reactToMessageController = async (req, res) => { 
    try {
        const { messageId } = req.params
        
        const message = await Message.findById(messageId)

        if (!message) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Message not found!", 404))
        }

        const updatedMessage = await Message.findByIdAndUpdate(messageId, {$set: {
            reacted: !message.reacted
        }},
            { new: true }
        )

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { message: updatedMessage }, "Message reacted successfully!", 200))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}

// Delete message
export const deleteMessageController = async (req, res) => { 
    try {
        const { messageId } = req.params

        const message = await Message.findById(messageId)

        if (!message) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Message not found!", 404))
        }

        await Message.findByIdAndDelete(messageId);

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, null, "Message deleted successfully!", 200))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}