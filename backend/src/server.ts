// Express
import express from "express";

// CORS
import cors from "cors";

// Cookie Parser and Session
import cookieParser from "cookie-parser";
import session from "express-session";

import { createClient } from "redis";
import RedisStore from "connect-redis";

require("dotenv").config();

import { authRoutes } from "./routes/auth.routes";
import { adminRoutes } from "./routes/admin.routes";

declare module "express-session" {
  export interface SessionData {
    user: { userId: string };
    environment: string;
  }
}

const initializeApp = async () => {

  const app = express();

  const port = process.env.PORT ?? (8080 as number);
  const DEPLOYMENT = process.env.DEPLOYMENT ?? "LOCAL";
  const SESS_NAME = process.env.SESS_NAME;
  const SESS_SECRET = process.env.SESS_SECRET;

  const redisClient = createClient();


  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    express.json({
      limit: "5mb",
      type: ["application/json", "text/plain"],
    })(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid JSON" });
      } else {
        next();
      }
    });
  });

  app.use(cookieParser());


  const localWhitelist = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
  ];

  const testingWhitelist: any[] = [];

  const productionWhitelist: any[] = [];

  const corsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Headers",
      "x-csrf-token",
      "Set-Cookie",
    ],
    origin:
      DEPLOYMENT === "LOCAL"
        ? localWhitelist
        : DEPLOYMENT === "TESTING"
        ? testingWhitelist
        : productionWhitelist,
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  };

  app.use(cors(corsOptions));

    // @ts-ignore
    let redisStore = new RedisStore({ client: redisClient });

    const sessionConfig = {
      secret: SESS_SECRET as string,
      resave: false,
      name: SESS_NAME as string,
      saveUninitialized: false,
      proxy: true,
      store: redisStore,
      cookie: {
        sameSite: true,
        secure: DEPLOYMENT === "LOCAL" ? false : true,
        maxAge: 1000 * 60 * 60 * 12,
      },
    };
  
    app.use(session(sessionConfig));


  app.get("/", (req, res) => {
    res.send("MIT Innovation Centre Management Portal!");
  });

  // Admin routes
  app.use("/api/admin", adminRoutes);

  // Auth routes
  app.use("/api/auth", authRoutes);



  app.listen(port, async () => {
    try {
      await redisClient.connect();
      console.log(`Redis connected`);
    } catch (err) {
      console.log(err);
    }
    
    console.log(`Express is listening at http://localhost:${port}`);
  });
};

initializeApp().catch((error) => {
  console.error("Failed to initialize server:", error);
  process.exit(1);
});
