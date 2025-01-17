import mongoose from "mongoose";
import envs from "./env.config.js";
import { logger } from "../utils/logger.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(envs.MONGO_URL);
        //console.log("MongoDB conectado");
        logger.info("MongoDB conectado")
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        throw error;
    }
};