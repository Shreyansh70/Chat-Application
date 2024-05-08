import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { getRecieverSocketId } from '../socket/socket.js';
import {io} from '../socket/socket.js';
export const sendMessage = async (req,res) => {
    try {
        const {message} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants : { $all : [senderId, recieverId] }
        });
        // console.log(req.user);
        
        if(!conversation) {
            conversation = await Conversation.create({
                participants : [recieverId , senderId]
            });
        }
        console.log(conversation);
        const newMessage  = await Message.create({
            message,
            senderId,
            recieverId
        });

        if(newMessage)
        conversation.messages.push(newMessage._id);
        


        // await conversation.save();
        // await newMessage.save();

        // this will run parallely
        await Promise.all([conversation.save(), newMessage.save()]);

        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId)
        {
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error at sendMessage functionality ' + error)
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getMessage = async (req,res) => {
    try {
        const {id: recieverId} = req.params
    const senderId = req.user._id

    // const conversation = await Conversation.findOne({
    //     participants: { $all: [senderId, recieverId] }
    // });

    // let messages = [];
    // if (conversation) {
    //     messages = await Message.find({
    //         _id: { $in: conversation.messages }
    //     });
    // }

    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, recieverId] }
    }).populate("messages");

    if(!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);

    } catch (error) {
        console.log('Error at getMessage functionality ' + error)
        res.status(500).json({message: "Internal Server Error"});
    }
}