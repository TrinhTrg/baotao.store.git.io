const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
    }
);

chatMessageSchema.index({ conversationId: 1, timestamp: -1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema, "chat_messages");
