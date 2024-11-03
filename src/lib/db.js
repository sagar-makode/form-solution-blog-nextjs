import mongoose from 'mongoose';

export async function connect() {
    try {

        // Connect to MongoDB with additional options
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
        });
        // mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit(1);
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);

    }


}