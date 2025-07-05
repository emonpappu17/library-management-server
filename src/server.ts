import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import dotenv from 'dotenv';
dotenv.config();

let server: Server;
const port = 5000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log('Connected to MongoDB using Mongoose');
        server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

main();