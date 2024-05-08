import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message : {
        type: 'string',
        required: true
    },
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recieverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

const Message = mongoose.model('Message',messageSchema);

export default Message;