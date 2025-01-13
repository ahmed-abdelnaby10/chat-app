// We need 3 endpoints to our chat app
import { formatResponse } from "../../utils/formatResponse.js";
import { httpStatus } from "../../utils/httpStatusText.js";
import Chat from "../../models/chat.model.js";
import User from "../../models/user.model.js";
import { checkRequiredFields } from "../../utils/checkRequiredFields.js";
// Creat Chat
export const createChatController = async (req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] }
        })

        if (!checkRequiredFields(req, res, ['firstId', 'secondId'])) {
            return;
        }
        // Verify if users exist
        const firstUser = await User.findById(firstId);
        const secondUser = await User.findById(secondId);

        if (!firstUser || !secondUser) {
            const missingUser = !firstUser ? 'First User' : 'Second User';
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, `${missingUser} does not exist.`, 404));
        }

        if (chat) {
            return res.status(200).json(formatResponse(httpStatus.SUCCESS, { chat }, 'Chat fetched successfully.', 200));
        }
        
        const newChat = new Chat({
            members: [firstId, secondId]
        })
        
        const response = await newChat.save()
        return res.status(201).json(formatResponse(httpStatus.SUCCESS, { chat: response }, 'Chat created successfully.', 201));
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}

// Get user's chats
export const findUserChatsController = async (req, res) => {
    const userId = req.params.userId
    try {
        // Verify if users exist
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, `User does not exist.`, 404));
        }

        const chats = await Chat.aggregate([
            { $match: { members: { $in: [userId] } } },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chatId",
                    as: "messages",
                },
            },
            {
                $addFields: {
                    latestMessage: { $arrayElemAt: [{ $sortArray: { input: "$messages", sortBy: { created_at: -1 } } }, 0] },
                },
            },
            {
                $project: {
                    messages: 0, // Exclude all messages except the latest one
                },
            },
        ]);

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { chats }, 'Chats fetched successfully.', 200));
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}

// Find specific Chat
export const findSpecificChatController = async (req, res) => {
    const { firstId, secondId } = req.params
    try {
        // Verify if users exist
        const firstUser = await User.findById(firstId);
        const secondUser = await User.findById(secondId);

        if (!firstUser || !secondUser) {
            const missingUser = !firstUser ? 'First User' : 'Second User';
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, `${missingUser} does not exist.`, 404));
        }

        // const chat = await Chat.findOne({
        //     members: { $all: [firstId, secondId] }
        // })

        // ************************************************************************************

        const chat = await Chat.aggregate([
            { $match: { members: { $all: [firstId, secondId] } } },
            {
                $lookup: {
                    from: "messages", // Collection name in MongoDB for messages
                    localField: "_id",
                    foreignField: "chatId",
                    as: "messages",
                },
            },
            {
                $addFields: {
                    latestMessage: { $arrayElemAt: [{ $sortArray: { input: "$messages", sortBy: { created_at: -1 } } }, 0] },
                },
            },
            {
                $project: {
                    messages: 0, // Exclude all messages except the latest one
                },
            },
        ])

        // ************************************************************************************
        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { chat }, 'Chat fetched successfully.', 200));
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}

// Delete chat
export const deleteChatController = async (req, res) => { 
    try {
        const { chatId } = req.params

        const chat = await Chat.findById(chatId)

        if (!chat) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Chat not found!", 404))
        }

        await Chat.findByIdAndDelete(chatId);

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, null, "Chat deleted successfully!", 200))
    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500))
    }
}