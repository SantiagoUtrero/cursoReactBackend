import express from "express";
import routes from "./routes/index.js";
import handlebars from "express-handlebars";
import { connectMongoDB } from "./config/mongoDb.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import envs from './config/env.config.js';
import { errorHandle } from "./errors/errorHandle.js";
import { logger } from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swagger.config.js";

// Conexión con la base de datos
connectMongoDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(envs.CODE_SECRET));
app.use(session({
    store: MongoStore.create({
        mongoUrl: envs.MONGO_URL,
        ttl: 15,
    }),
    secret: envs.CODE_SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api", routes);

app.use(errorHandle);

const port = envs.PORT;

// Inicia el servidor
app.listen(port, () => logger.info(`server ready on port ${port}`));

// Ruta de prueba
app.get("/api", (req, res) => {
    try {
        const message = "Welcome to my server";
        return res.json({ status: 200, response: message });
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, response: error.message });
    }
});