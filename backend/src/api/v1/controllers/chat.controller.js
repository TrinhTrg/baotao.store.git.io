const mongoose = require("mongoose");
const ChatMessage = require("../../../models/chatMessage.model.js");
const User = require("../../../models/user.model.js");
const ApiError = require("../../../utils/apiError.js");
const ResponseFormatter = require("../../../utils/response.js");

const buildConversationId = (userId, otherUserId) => {
    const ids = [userId.toString(), otherUserId.toString()].sort();
    return `${ids[0]}-${ids[1]}`;
};

module.exports.getConversations = async (req, res, next) => {
    try {
        const currentUserId = req.user?._id;
        if (!currentUserId) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const currentObjectId = new mongoose.Types.ObjectId(currentUserId);

        const conversations = await ChatMessage.aggregate([
            {
                $match: {
                    $or: [{ sender: currentObjectId }, { receiver: currentObjectId }],
                },
            },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver", currentObjectId] },
                                        { $eq: ["$isRead", false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const otherUserIds = conversations
            .map((conversation) => {
                const last = conversation.lastMessage;
                if (!last) return null;
                return last.sender?.toString() === currentUserId.toString()
                    ? last.receiver
                    : last.sender;
            })
            .filter(Boolean);

        const uniqueOtherIds = [...new Set(otherUserIds.map((id) => id.toString()))];

        const users = await User.find({ _id: { $in: uniqueOtherIds } })
            .select("fullName avatar shopName isSeller")
            .lean();

        const userMap = new Map(
            users.map((u) => [u._id.toString(), { ...u, id: u._id.toString() }])
        );

        const formatted = conversations.map((conversation) => {
            const last = conversation.lastMessage;
            const otherId =
                last.sender?.toString() === currentUserId.toString()
                    ? last.receiver?.toString()
                    : last.sender?.toString();
            const otherUser = userMap.get(otherId) || null;

            return {
                conversationId: conversation._id,
                otherUser: otherUser
                    ? {
                        id: otherUser.id,
                        name: otherUser.fullName,
                        avatar: otherUser.avatar || null,
                        shopName: otherUser.shopName || null,
                        isSeller: !!otherUser.isSeller,
                    }
                    : null,
                lastMessage: last
                    ? {
                        id: last._id,
                        sender: last.sender,
                        receiver: last.receiver,
                        content: last.content,
                        timestamp: last.timestamp,
                        isRead: last.isRead,
                    }
                    : null,
                unreadCount: conversation.unreadCount || 0,
            };
        });

        return ResponseFormatter.success(
            res,
            { conversations: formatted },
            "Conversations retrieved successfully."
        );
    } catch (error) {
        console.error("❌ Error fetching conversations:", error);
        next(new ApiError(500, "Failed to load conversations."));
    }
};

module.exports.getHistory = async (req, res, next) => {
    try {
        const currentUserId = req.user?._id;
        if (!currentUserId) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const { otherUserId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return next(new ApiError(400, "Invalid participant."));
        }

        const otherUser = await User.findById(otherUserId)
            .select("_id fullName avatar shopName isSeller")
            .lean();

        if (!otherUser) {
            return next(new ApiError(404, "Recipient not found."));
        }

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
        const skip = (page - 1) * limit;

        const conversationId = buildConversationId(currentUserId, otherUserId);

        const [messages, totalMessages] = await Promise.all([
            ChatMessage.find({ conversationId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ChatMessage.countDocuments({ conversationId }),
        ]);

        await ChatMessage.updateMany(
            {
                conversationId,
                receiver: currentUserId,
                isRead: false,
            },
            { $set: { isRead: true } }
        );

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalMessages / limit) || 1,
            totalItems: totalMessages,
            limit,
        };

        return ResponseFormatter.success(
            res,
            {
                conversationId,
                participant: {
                    id: otherUser._id.toString(),
                    name: otherUser.fullName,
                    avatar: otherUser.avatar || null,
                    shopName: otherUser.shopName || null,
                    isSeller: !!otherUser.isSeller,
                },
                messages: messages.reverse(),
                pagination,
            },
            "Conversation history retrieved successfully."
        );
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        next(new ApiError(500, "Failed to load conversation history."));
    }
};

module.exports.buildConversationId = buildConversationId;
