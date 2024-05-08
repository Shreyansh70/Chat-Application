import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const connectToMongoDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}

export default connectToMongoDB;