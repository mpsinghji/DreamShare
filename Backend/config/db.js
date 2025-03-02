import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "SocialMedia",
    });

    console.log(`MongoDB is successfully connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectdb;
