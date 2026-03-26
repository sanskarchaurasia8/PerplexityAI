import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        let chat = null;
        let title = null;

        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
        }

        const activeChatId = chatId || chat._id;

        await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user",
        });

        const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 });
        const result = await generateResponse(
            messages.map((msg) => ({ role: msg.role, content: msg.content }))
        );

        const aimessage = await messageModel.create({
            chat: activeChatId,
            content: result,
            role: "ai",
        });

        const savedChat = chat || (await chatModel.findById(activeChatId));

        return res.status(201).json({
            AIMessage: result,
            title: savedChat?.title ?? title,
            chat: savedChat,
            aimessage,
        });
    } catch (error) {
        console.error("Chat generation failed", error);
        return res.status(500).json({
            message: "AI response generation failed",
            success: false,
            err: error.message || "Unknown error",
        });
    }
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats,
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id,
    });

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
        });
    }

    const messages = await messageModel.find({ 
        chat: chatId 
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages,
    });
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id,
    });

    await messageModel.deleteMany({
        chat: chatId
    });


    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
        });
    }

    res.status(200).json({
        message: "Chat deleted successfully",
    });
}

