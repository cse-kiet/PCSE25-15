import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDBURI,);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Errorm connecting to mongodb', error.message);
    }
};

export default connectDB;